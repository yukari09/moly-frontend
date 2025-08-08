import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sendEmail } from "@/lib/email";
import { EmailVerificationTemplate } from "@/emails/EmailVerificationTemplate";
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

        const registerRes = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerMutation),
        });

        const registerData = await registerRes.json();

        if (registerData.errors || (registerData.data.registerWithPassword && registerData.data.registerWithPassword.errors.length > 0)) {
          const apiErrors = registerData.data?.registerWithPassword?.errors || registerData.errors;
          const errorMessage = apiErrors?.[0]?.message || 'An unknown error occurred during registration.';
          throw new Error(errorMessage);
        }

        if (!registerData.data.registerWithPassword.result) {
          throw new Error('Registration failed: No user data returned.');
        }
        
        const gqlUser = registerData.data.registerWithPassword.result;
        const accessToken = registerData.data.registerWithPassword.metadata.token;

        // Generate email confirmation token by calling the GraphQL API
        const generateTokenMutation = {
          query: `
            mutation GenerateConfirmToken($purpose: String!) {
              generateConfirmToken(purpose: $purpose)
            }
          `,
          variables: {
            purpose: "confirm_new_user",
          },
        };

        const tokenRes = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(generateTokenMutation),
        });

        const tokenData = await tokenRes.json();
        
        if (tokenData.errors || !tokenData.data.generateConfirmToken) {
            // Log the error but don't block the user from logging in
            console.error("Could not generate email verification token:", tokenData.errors?.[0]?.message);
        } else {
            const verificationToken = tokenData.data.generateConfirmToken;
            const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    
            sendEmail({
              to: gqlUser.email,
              subject: `Welcome to ${process.env.APP_NAME}! Please Verify Your Email`,
              react: <EmailVerificationTemplate 
                        name={gqlUser.name || gqlUser.username} 
                        verificationLink={verificationLink}
                     />
            }).catch(console.error);
        }

        return {
          id: gqlUser.id,
          name: gqlUser.name || gqlUser.username,
          email: gqlUser.email,
          image: gqlUser.avatar,
          accessToken: accessToken,
        };
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const isTokenValid = await verifyTurnstileToken(credentials.turnstileToken);
        if (!isTokenValid) {
          throw new Error("Invalid Turnstile token. Please try again.");
        }

        const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;
        const loginMutation = {
          query: `
            mutation SignInWithPassword($email: String!, $password: String!) {
              signInWithPassword(email: $email, password: $password, agreement: "true") {
                id, name, email, avatar, username, token, status
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
            status: userWithToken.status,
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
    async jwt({ token, user, trigger, session }) {
      // Handle session updates, specifically for the user's status
      if (trigger === "update" && session?.user?.status) {
        token.status = session.user.status;
      }

      // Handle initial sign-in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accessToken = user.accessToken;
        // @ts-ignore
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        // @ts-ignore
        session.user.status = token.status;
      }
      // @ts-ignore
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