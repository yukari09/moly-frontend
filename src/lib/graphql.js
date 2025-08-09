import logger from "./logger";

/**
 * The single, centralized function to make GraphQL requests.
 * This is not exported directly, but used by the specific API call functions.
 * @param {string} query The GraphQL query or mutation string.
 * @param {object} [variables={}] The variables for the query.
 * @param {object} [session=null] The NextAuth session object, used for authentication.
 * @returns {Promise<any>} The `data` part of the GraphQL response.
 */
async function _request(query, variables = {}, session = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (session?.accessToken) {
    // @ts-ignore
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(process.env.GRAPHQL_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();

  if (!res.ok || data.errors) {
    const errorMessage = data.errors?.[0]?.message || "An unknown GraphQL error occurred.";
    logger.error("GraphQL Request Failed:", { query: query.trim().split('\n')[0].trim(), variables, errorMessage });
    throw new Error(errorMessage);
  }

  return data.data;
}

// --- QUERIES ---

const IS_USERNAME_AVAILABLE_QUERY = `
  query IsNotUsernameAvailable($username: String!) {
    isNotUsernameAvailable(username: $username)
  }
`;
export async function isUsernameAvailable(username, session) {
  const data = await _request(IS_USERNAME_AVAILABLE_QUERY, { username }, session);
  return data.isNotUsernameAvailable;
}

const LIST_TERMS_QUERY = `
  query ListTerms($taxonomyName: String!) {
    listTerms(taxonomyName: $taxonomyName) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;
export async function listTerms(taxonomyName, session) {
  const data = await _request(LIST_TERMS_QUERY, { taxonomyName }, session);
  return data.listTerms.edges.map(edge => edge.node);
}


// --- MUTATIONS ---

const REGISTER_MUTATION = `
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
    }
  }
`;
export async function register(input) {
  const data = await _request(REGISTER_MUTATION, { input });
  return data.registerWithPassword;
}

const SIGN_IN_MUTATION = `
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
`;
export async function signInWithPassword(email, password) {
  const data = await _request(SIGN_IN_MUTATION, { email, password });
  return data.signInWithPassword;
}

const GENERATE_CONFIRM_TOKEN_MUTATION = `
  mutation GenerateConfirmToken($purpose: String!) {
    generateConfirmToken(purpose: $purpose)
  }
`;
export async function generateConfirmToken(purpose, session) {
  const data = await _request(GENERATE_CONFIRM_TOKEN_MUTATION, { purpose }, session);
  return data.generateConfirmToken;
}

const GENERATE_RESET_TOKEN_MUTATION = `
  mutation GenerateResetToken($email: String!) {
    generateResetToken(email: $email)
  }
`;
export async function generateResetToken(email) {
  const data = await _request(GENERATE_RESET_TOKEN_MUTATION, { email });
  return data.generateResetToken;
}

const UPDATE_USER_META_MUTATION = `
  mutation UpdateUserMeta($userMeta: [UserMetaInput!]) {
    updateUserMeta(userMeta: $userMeta) {
      id
      email
      userMeta {
        id
        metaKey
        metaValue
      }
    }
  }
`;
export async function updateUserMeta(userMeta, session) {
  const data = await _request(UPDATE_USER_META_MUTATION, { userMeta }, session);
  return data.updateUserMeta;
}

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      result {
        id
        postName
      }
    }
  }
`;
export async function createPost(input, session) {
  const data = await _request(CREATE_POST_MUTATION, { input }, session);
  return data.createPost;
}

const CREATE_TERM_MUTATION = `
  mutation CreateTerm($input: CreateTermInput!) {
    createTerm(input: $input) {
      result {
        id
        name
        slug
      }
    }
  }
`;
export async function createTerm(input, session) {
  const data = await _request(CREATE_TERM_MUTATION, { input }, session);
  return data.createTerm.result;
}

// Note: `uploadMedia` using standard fetch is complex due to multipart/form-data.
// It's often handled outside a generic JSON-based client like this.
// We will add a placeholder for now.
export async function uploadMedia(file, session) {
  // This requires a different setup using FormData and multipart request.
  // For now, this is a placeholder.
  logger.warn("uploadMedia is not fully implemented in the GraphQL client yet.");
  return null;
}
