import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendEmail } from "@/lib/email";
import { EmailVerificationTemplate } from "@/emails/EmailVerificationTemplate";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";

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
                result {
                  id
                  email
                  userMeta {
                    id
                    metaKey
                    metaValue
                  }
                }
                metadata {
                  token
                }
                errors {
                  fields
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              email: credentials.email,
              password: credentials.password,
              passwordConfirmation: credentials.password,
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

        const registrationResult = registerData.data.registerWithPassword;
        if (!registrationResult || !registrationResult.result) {
          throw new Error('Registration failed: No user data returned.');
        }
        
        const gqlUser = registrationResult.result;
        const accessToken = registrationResult.metadata.token;
        const userMeta = gqlUser.userMeta;

        const generateTokenMutation = {
          query: `mutation GenerateConfirmToken($purpose: String!) { generateConfirmToken(purpose: $purpose) }`,
          variables: { purpose: "confirm_new_user" },
        };

        const tokenRes = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify(generateTokenMutation),
        });

        const tokenData = await tokenRes.json();
        
        if (tokenData.errors || !tokenData.data.generateConfirmToken) {
            logger.error("Could not generate email verification token:", tokenData.errors?.[0]?.message);
        } else {
            const verificationToken = tokenData.data.generateConfirmToken;
            const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
            const userName = getMetaValue(userMeta, "name") || getMetaValue(userMeta, "username");
            sendEmail({
              to: gqlUser.email,
              subject: `Welcome to ${process.env.APP_NAME}! Please Verify Your Email`,
              react: <EmailVerificationTemplate name={userName} verificationLink={verificationLink} />
            }).catch(logger.error);
        }

        const userObject = {
          id: gqlUser.id,
          name: getMetaValue(userMeta, "name"),
          email: gqlUser.email,
          image: getMetaValue(userMeta, "avatar"),
          username: getMetaValue(userMeta, "username"),
          status: getMetaValue(userMeta, "status"),
          accessToken: accessToken,
          userMeta: userMeta,
        };

        logger.info("User successfully registered:", userObject);
        return userObject;
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
      async authorize(credentials) {
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
                id
                token
                email
                userMeta {
                  id
                  metaKey
                  metaValue
                }
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

          const gqlUser = data.data.signInWithPassword;
          const userMeta = gqlUser.userMeta;

          const userObject = {
            id: gqlUser.id,
            name: getMetaValue(userMeta, "name"),
            email: gqlUser.email,
            image: getMetaValue(userMeta, "avatar"),
            username: getMetaValue(userMeta, "username"),
            status: getMetaValue(userMeta, "status"),
            accessToken: gqlUser.token,
            userMeta: userMeta,
          };

          logger.info("User successfully authenticated:", userObject);
          return userObject;

        } catch (error) {
          logger.error("Authentication error:", error);
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
      if (trigger === "update" && session?.user) {
        if (session.user.userMeta) {
          // @ts-ignore
          token.userMeta = session.user.userMeta;
          // @ts-ignore
          token.name = getMetaValue(session.user.userMeta, "name");
          // @ts-ignore
          token.image = getMetaValue(session.user.userMeta, "avatar");
          // @ts-ignore
          token.username = getMetaValue(session.user.userMeta, "username");
        }
        if (session.user.status) {
          token.status = session.user.status;
        }
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accessToken = user.accessToken;
        // @ts-ignore
        token.status = user.status;
        // @ts-ignore
        token.username = user.username;
        // @ts-ignore
        token.userMeta = user.userMeta;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        // @ts-ignore
        session.user.status = token.status;
        // @ts-ignore
        session.user.username = token.username;
        // @ts-ignore
        session.user.userMeta = token.userMeta;
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
