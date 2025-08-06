import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  console.log('--- ENVIRONMENT VARIABLE DEBUG ---');
  console.log(`GRAPHQL_API_URL is: ${env.GRAPHQL_API_URL}`);
  console.log(`AUTH_SECRET is: ${env.AUTH_SECRET}`);
  console.log('------------------------------------');
  
  return {
    message: 'Check your server console for the environment variable logs.'
  };
}
