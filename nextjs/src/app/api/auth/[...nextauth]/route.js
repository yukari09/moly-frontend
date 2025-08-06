import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/email";
import { EmailVerificationTemplate } from "@/emails/EmailVerificationTemplate";
import crypto from "crypto";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "register",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const isTokenValid = await verifyTurnstileToken(credentials.turnstileToken);
        if (!isTokenValid) {
          throw new Error("Invalid Turnstile token. Please try again.");
        }

        const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;
        const registerMutation = {
          query: `
            mutation Register($input: RegisterWithPasswordInput!) {
              registerWithPassword(input: $input) {
                result { id, name, email, avatar, username }
                metadata { token }
                errors { fields, message }
              }
            }
          `,
          variables: {
            input: {
              email: credentials.email,
              password: credentials.password,
              passwordConfirmation: credentials.password, // Assuming confirmation is same as password for now
              agreement: "true",
            },
          },
        };

        const res = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerMutation),
        });

        const data = await res.json();

        if (data.errors || (data.data.registerWithPassword && data.data.registerWithPassword.errors.length > 0)) {
          const apiErrors = data.data?.registerWithPassword?.errors || data.errors;
          const errorMessage = apiErrors?.[0]?.message || 'An unknown error occurred during registration.';
          throw new Error(errorMessage);
        }

        if (!data.data.registerWithPassword.result) {
          throw new Error('Registration failed: No user data returned.');
        }
        
        const gqlUser = data.data.registerWithPassword.result;
        const token = data.data.registerWithPassword.metadata.token;

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await prisma.user.create({
          data: {
            id: gqlUser.id,
            email: gqlUser.email,
            name: gqlUser.name || gqlUser.username,
            avatar: gqlUser.avatar,
            verificationToken: hashedToken,
            verificationTokenExpires: tokenExpires,
          }
        });
        
        const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

        sendEmail({
          to: user.email,
          subject: "Verify your email address",
          react: <EmailVerificationTemplate 
                    name={user.name} 
                    verificationLink={verificationLink}
                 />
        }).catch(console.error);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          accessToken: token,
        };
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;
        const loginMutation = {
          query: `
            mutation SignInWithPassword($email: String!, $password: String!) {
              signInWithPassword(email: $email, password: $password, agreement: "true") {
                id, name, email, avatar, username, token
              }
            }
          `,
          variables: {
            email: credentials.email,
            password: credentials.password,
          },
        };

        try {
          const res = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginMutation),
          });

          const data = await res.json();
          
          if (data.errors || !data.data.signInWithPassword) {
            const errorMessage = data.errors?.[0]?.message || "Invalid credentials";
            throw new Error(errorMessage);
          }

          const userWithToken = data.data.signInWithPassword;

          return {
            id: userWithToken.id,
            name: userWithToken.name || userWithToken.username,
            email: userWithToken.email,
            image: userWithToken.avatar,
            accessToken: userWithToken.token,
          };

        } catch (error) {
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }