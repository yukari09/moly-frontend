import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendEmail } from "@/lib/email";
import { EmailVerificationTemplate } from "@/emails/EmailVerificationTemplate";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";
import * as gql from "@/lib/graphql";

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

        await verifyTurnstileToken(credentials.turnstileToken);

        const registrationResult = await gql.register({
          email: credentials.email,
          password: credentials.password,
          passwordConfirmation: credentials.password,
          agreement: "true",
        });

        if (!registrationResult || !registrationResult.result) {
          throw new Error('Registration failed: Email has been taken.');
        }
        
        const gqlUser = registrationResult.result;
        const accessToken = registrationResult.metadata.token;
        const userMeta = gqlUser.userMeta;

        // Create a temporary session to generate the confirm token
        const tempSession = { accessToken };

        (async () => {
          try {
            const verificationToken = await gql.generateConfirmToken("confirm_new_user", tempSession);
            const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
            const userName = getMetaValue(userMeta, "name") || getMetaValue(userMeta, "username");
            
            await sendEmail({
              to: gqlUser.email,
              subject: `Welcome to ${process.env.APP_NAME}! Please Verify Your Email`,
              react: <EmailVerificationTemplate name={userName} verificationLink={verificationLink} />
            });
          } catch (emailError) {
            logger.error("Failed to send verification email in background:", emailError);
          }
        })();

        const userObject = {
          id: gqlUser.id,
          name: getMetaValue(userMeta, "name"),
          email: gqlUser.email,
          image: getMetaValue(userMeta, "avatar"),
          username: getMetaValue(userMeta, "username"),
          status: gqlUser.status || getMetaValue(userMeta, "status"),
          roles: gqlUser.roles || [],
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

        await verifyTurnstileToken(credentials.turnstileToken);

        try {
          const gqlUser = await gql.signInWithPassword(credentials.email, credentials.password);
          const userMeta = gqlUser.userMeta;

          const userObject = {
            id: gqlUser.id,
            name: getMetaValue(userMeta, "name"),
            email: gqlUser.email,
            image: getMetaValue(userMeta, "avatar"),
            username: getMetaValue(userMeta, "username"),
            status: gqlUser.status || getMetaValue(userMeta, "status"),
            roles: gqlUser.roles || [],
            accessToken: gqlUser.token,
            userMeta: userMeta,
          };

          logger.info("User successfully authenticated:", userObject);
          return userObject;

        } catch (error) {
          logger.error("Authentication error:", error);
          // Re-throw the error to be caught by NextAuth and displayed to the user
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
      if (user) { // Initial sign in
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          accessToken: user.accessToken,
          status: user.status,
          username: user.username,
          roles: user.roles,
          userMeta: user.userMeta,
        };
      }

      if (trigger === "update" && session?.user) { // Session update
        const newSessionUser = session.user;
        const updatedToken = { ...token };
        if (newSessionUser.userMeta) {
          updatedToken.userMeta = newSessionUser.userMeta;
          updatedToken.name = getMetaValue(newSessionUser.userMeta, "name");
          updatedToken.image = getMetaValue(newSessionUser.userMeta, "avatar");
          updatedToken.username = getMetaValue(newSessionUser.userMeta, "username");
        }
        if (newSessionUser.status) {
          updatedToken.status = newSessionUser.status;
        }
        return updatedToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        // @ts-ignore
        session.user.status = token.status;
        // @ts-ignore
        session.user.username = token.username;
        // @ts-ignore
        session.user.roles = token.roles;
        // @ts-ignore
        session.user.userMeta = token.userMeta;
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
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
