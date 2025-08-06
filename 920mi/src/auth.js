// import { SvelteKitAuth } from "@auth/sveltekit";
// import Credentials from "@auth/core/providers/credentials";
// import { env } from "$env/dynamic/private";
// import { dev } from "$app/environment";

// // This is the GraphQL mutation for logging in.
// // Note: We have removed the 'agreement' variable for now to simplify debugging.
// const LOGIN_MUTATION = `
//   mutation SignInWithPassword($email: String!, $password: String!) {
//     signInWithPassword(email: $email, password: $password, agreement: "true") {
//       id
//       email
//       name
//       avatar
//       username
//       token
//     }
//   }
// `;

// // This is our custom provider for handling GraphQL authentication.
// const GraphQLProvider = {
//   id: "custom-credentials",
//   name: "GraphQL Login",
//   type: "credentials",
//   credentials: {
//     email: { label: "Email", type: "email" },
//     password: { label: "Password", type: "password" },
//     // The 'agreement' field is handled implicitly now.
//   },
//   async authorize(credentials) {
//     console.log("[authorize] Attempting to authorize credentials...");
    
//     const { email, password } = credentials;
//     if (!email || !password) {
//       console.error("[authorize] Missing email or password.");
//       throw new Error("Missing email or password.");
//     }

//     try {
//       console.log(`[authorize] Fetching GraphQL API at: ${env.GRAPHQL_API_URL}`);
//       const response = await fetch(env.GRAPHQL_API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: LOGIN_MUTATION,
//           variables: {
//             email: email,
//             password: password,
//           }
//         })
//       });

//       const data = await response.json();

//       if (data.errors) {
//         const errorMessage = data.errors[0]?.message || 'Authentication failed.';
//         console.error('[authorize] GraphQL returned errors:', data.errors);
//         throw new Error(errorMessage);
//       }

//       if (data.data?.signInWithPassword) {
//         const user = data.data.signInWithPassword;
//         console.log("[authorize] Authorization successful for user:", user.email);
//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name || user.username,
//           image: user.avatar,
//           accessToken: user.token,
//         };
//       }

//       console.log("[authorize] Authorization failed: No user data returned from API.");
//       return null;

//     } catch (error) {
//       console.error('[authorize] A critical error occurred:', error);
//       throw error; // Re-throw the error for Auth.js to handle.
//     }
//   }
// };

// // This is the main export for Auth.js configuration.
// export const { handle, signIn, signOut } = SvelteKitAuth({
//   providers: [GraphQLProvider],
  
//   session: {
//     strategy: "jwt",
//   },
  
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) { // user is only available on first sign-in
//         token.accessToken = user.accessToken;
//         token.id = user.id;
//       }
//       return token;
//     },
    
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.user.id = token.id;
//       return session;
//     },
//   },
  
//   debug: dev,
  
//   pages: {
//     signIn: '/signin',
//   },

//   secret: env.AUTH_SECRET,
// });