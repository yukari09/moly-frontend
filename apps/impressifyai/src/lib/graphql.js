import logger from "./logger";

/**
 * The single, centralized function to make GraphQL requests.
 * This is not exported directly, but used by the specific API call functions.
 * @param {string} query The GraphQL query or mutation string.
 * @param {object} [variables={}] The variables for the query.
 * @param {object} [session=null] The NextAuth session object, used for authentication.
 * @returns {Promise<any>} The `data` part of the GraphQL response.
 */
async function _request(query, variables = {}, session = null, cacheConfig = null) {
  const apiUrl = process.env.GRAPHQL_API_URL;
  if (!apiUrl) {
    throw new Error("GRAPHQL_API_URL is not defined in environment variables.");
  }
  const secretKey = process.env.GRAPHQL_SECRET_KEY;
  if (!secretKey) {
    throw new Error("GRAPHQL_SECRET_KEY is not defined in environment variables.");
  }
  const tenantKey = process.env.GRAPHQL_TENANT;
  if (!tenantKey) {
    throw new Error("GRAPHQL_TENANT is not defined in environment variables.");
  }

  const headers = { 'Content-Type': 'application/json', 'x-app-secret': secretKey, 'x-tenant-id': tenantKey};
  if (session?.accessToken) {
    // @ts-ignore
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  // Clean variables object by removing keys with null or undefined values.
  // This prevents issues with GraphQL APIs that are strict about optional inputs.
  const cleanedVariables = {};
  for (const key in variables) {
    if (variables[key] !== null && variables[key] !== undefined) {
      cleanedVariables[key] = variables[key];
    }
  }

  const fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: cleanedVariables }),
  };

  if (cacheConfig) {
    // If user passes { next: ... }, use its value. Otherwise, use the object directly.
    const nextConfig = cacheConfig.next ? cacheConfig.next : cacheConfig;
    // @ts-ignore
    fetchOptions.next = nextConfig;
  } else {
    // @ts-ignore
    fetchOptions.cache = 'no-store';
  }

  const res = await fetch(apiUrl, fetchOptions);

  const data = await res.json();

  if (!res.ok || data.errors) {
    const errorMessage = data.errors?.[0]?.message || "An unknown GraphQL error occurred.";
    logger.error("GraphQL Request Failed:", { query: query.trim().split('\n')[1].trim(), variables: cleanedVariables, errorMessage });
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
export async function isUsernameAvailable(username, session, cacheConfig) {
  const data = await _request(IS_USERNAME_AVAILABLE_QUERY, { username }, session, cacheConfig);
  return data.isNotUsernameAvailable;
}

const LIST_TERMS_QUERY = `
  query ListTerms($taxonomyName: String!, $first: Int, $after: String, $filter: TermFilterInput) {
    listTerms(taxonomyName: $taxonomyName, first: $first, after: $after, filter: $filter) {
      count
      edges {
        cursor
        node {
          id
          name
          slug
          insertedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
export async function listTerms(taxonomyName, first, after, filter, session, cacheConfig) {
  const data = await _request(LIST_TERMS_QUERY, { taxonomyName, first, after, filter }, session, cacheConfig);
  return data.listTerms;
}

const LIST_TERMS_OFFSET_QUERY = `
  query ListTermsOffset($taxonomyName: String, $limit: Int, $offset: Int, $filter: TermFilterInput, $sort: [TermSortInput], $parent: ID, $slug: String) {
    listTermsOffset(taxonomyName: $taxonomyName, limit: $limit, offset: $offset, filter: $filter, sort: $sort, parent: $parent, slug: $slug) {
      count
      results {
        id
        name
        slug
        termMeta{
          termKey
          termValue
        }
        termTaxonomy(filter: {
          taxonomy: { eq: $taxonomyName }
        }){
          id
          taxonomy
          description
          count
          parent_id
        }
        insertedAt
      }
    }
  }
`;
export async function listTermsOffset(taxonomyName, limit, offset, filter, session, sort, parent, slug, cacheConfig) {
  const data = await _request(LIST_TERMS_OFFSET_QUERY, { taxonomyName, limit, offset, filter, sort, parent, slug }, session, cacheConfig);
  return data.listTermsOffset;
}

const LIST_POSTS_OFFSET_QUERY = `
  query ListPostsOffset($limit: Int, $offset: Int, $filter: PostFilterInput, $sort: [PostSortInput]) {
    listPostsOffset(limit: $limit, offset: $offset, filter: $filter, sort: $sort) {
      count
      results {
        id
        postTitle
        postStatus
        insertedAt
        postName
        postTags{
          name
          slug
          termTaxonomy(filter: {taxonomy: {eq: "post_tag"}}){
            id
          }
        }
        categories{
          name
          slug
          termTaxonomy(filter: {taxonomy: {eq: "category"}}){
            id
          }
        }
      }
    }
  }
`;
export async function listPostsOffset(limit, offset, filter, sort, session, cacheConfig) {
  const data = await _request(LIST_POSTS_OFFSET_QUERY, { limit, offset, filter, sort }, session, cacheConfig);
  return data.listPostsOffset;
}


const GET_TERM_QUERY = `
  query GetTerm($id: ID!, $taxonomyName: String!) {
    getTerm(id: $id) {
      id
      name
      slug
      termTaxonomy(filter: {
        taxonomy: { eq: $taxonomyName }
      }) {
        id
        taxonomy
        count
        description
        parent {
          id
        }
      }
      termMeta{
        termKey
        termValue
      }  
    }
  }
`;
export async function getTerm(id, taxonomyName, session, cacheConfig) {
  const data = await _request(GET_TERM_QUERY, { id, taxonomyName }, session, cacheConfig);
  return data.getTerm;
}

const GET_USER_BY_USERNAME_QUERY = `
  query ReadOneUser($filter: UserFilterInput) {
    readOneUser(filter: $filter) {
      id
      email
      userMeta {
        metaKey
        metaValue
      }
    }
  }
`;
export async function getUserByUsername(username, session, cacheConfig) {
  const filter = {
    userMeta: {
      metaKey: { eq: "username" },
      metaValue: { eq: username },
    },
  };
  const data = await _request(GET_USER_BY_USERNAME_QUERY, { filter }, session, cacheConfig);
  return data.readOneUser;
}

const LIST_USERS_OFFSET_QUERY = `
  query ListUsersOffset($limit: Int, $offset: Int, $filter: UserFilterInput, $sort: [UserSortInput]) {
    listUsersOffset(limit: $limit, offset: $offset, filter: $filter, sort: $sort) {
      count
      results {
        id
        email
        userMeta {
          id
          metaKey
          metaValue
        } 
        insertedAt
        updatedAt
      }
    }
  }
`;
export async function listUsersOffset(limit, offset, filter, sort, session, cacheConfig) {
  const data = await _request(LIST_USERS_OFFSET_QUERY, { limit, offset, filter, sort }, session, cacheConfig);
  return data.listUsersOffset;
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
      errors{
          message
          shortMessage
      }
      metadata {
        token
      }
    }
  }
`;
export async function register(input) {
  const data = await _request(REGISTER_MUTATION, { input });
  if (data.registerWithPassword.errors && data.registerWithPassword.errors.length > 0) {
    throw new Error(data.registerWithPassword.errors[0].message);
  }
  return data.registerWithPassword;
}

const SIGN_IN_MUTATION = `
  mutation SignInWithPassword($email: String!, $password: String!) {
    signInWithPassword(email: $email, password: $password) {
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

const VERIFY_CONFIRM_TOKEN_MUTATION = `
  mutation VerifyConfirmToken($purpose: String!, $token: String!) {
    verifyConfirmToken(purpose: $purpose, token: $token) {
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
export async function verifyConfirmToken(purpose, token) {
  const data = await _request(VERIFY_CONFIRM_TOKEN_MUTATION, { purpose, token });
  return data.verifyConfirmToken;
}

const RESET_PASSWORD_WITH_TOKEN_MUTATION = `
  mutation ResetPasswordWithToken($password: String!, $passwordConfirmation: String!, $resetToken: String!) {
    resetPasswordWithToken(password: $password, passwordConfirmation: $passwordConfirmation, resetToken: $resetToken) {
      id
      email
    }
  }
`;

export async function resetPasswordWithToken(password, passwordConfirmation, resetToken) {
  const data = await _request(RESET_PASSWORD_WITH_TOKEN_MUTATION, { password, passwordConfirmation, resetToken });
  return data.resetPasswordWithToken;
}

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      result {
        id
        postTitle
      }
      errors{
        fields  
        message
        shortMessage
      }
    }
  }
`;
export async function createPost(input, session) {
  const data = await _request(CREATE_POST_MUTATION, { input }, session);
  if (data.createPost.errors && data.createPost.errors.length > 0) {
    throw new Error(data.createPost.errors[0].fields.join("") + ":"  + data.createPost.errors[0].message);
  }
  return data.createPost.result;
}

const CREATE_TERM_MUTATION = `
  mutation CreateTerm($input: CreateTermInput!) {
    createTerm(input: $input) {
      result {
        id
        name
        slug
      }
      errors{
          message
          shortMessage
      }
    }
  }
`;
export async function createTerm(input, session) {
  const data = await _request(CREATE_TERM_MUTATION, { input }, session);
  return data.createTerm.result;
}

const DESTROY_TERM_MUTATION = `
  mutation DestroyTerm($id: ID!) {
    destroyTerm(id: $id) {
      result {
        id
      }
      errors{
          message
          shortMessage
      }
    }
  }
`;
export async function destroyTerm(id, session) {
  const data = await _request(DESTROY_TERM_MUTATION, { id }, session);
  if (data.destroyTerm.errors && data.destroyTerm.errors.length > 0) {
    throw new Error(data.destroyTerm.errors[0].message);
  }
  return data.destroyTerm.result;
}

const UPDATE_TERM_MUTATION = `
  mutation UpdateTerm($id: ID!, $input: UpdateTermInput!) {
    updateTerm(id: $id, input: $input) {
      result {
        id
        name
        slug
      }
      errors{
          message
          shortMessage
      }
    }
  }
`;
export async function updateTerm(id, input, session) {
  const data = await _request(UPDATE_TERM_MUTATION, { id, input }, session);
  if (data.updateTerm.errors && data.updateTerm.errors.length > 0) {
    throw new Error(data.updateTerm.errors[0].message);
  }
  return data.updateTerm.result;
}

const GET_POST_QUERY = `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      postTitle
      postContent
      postExcerpt
      postStatus
      postTags{
        name
        slug
        termTaxonomy(filter: {taxonomy: {eq: "post_tag"}}){
          id
        }
      }
      categories{
        name
        termTaxonomy(filter: {taxonomy: {eq: "category"}}){
          id
        }
      }
    }
  }
`;
export async function getPost(id, session, cacheConfig) {
  const data = await _request(GET_POST_QUERY, { id }, session, cacheConfig);
  return data.getPost;
}

const GET_POST_BY_POST_NAME_QUERY = `
  query GetPostByPostName($postName: String!) {
    getPostByPostName(postName: $postName) {
      id
      postTitle
      postContent
      postExcerpt
      postStatus
      postName
      insertedAt
      postTags{
        name
        slug
        termTaxonomy(filter: {taxonomy: {eq: "post_tag"}}){
          id
        }
      }
      categories{
        name
        slug
        termTaxonomy(filter: {taxonomy: {eq: "category"}}){
          id
        }
      }
    }
  }
`;
export async function getPostByPostName(postName, session, cacheConfig) {
  const data = await _request(GET_POST_BY_POST_NAME_QUERY, { postName }, session, cacheConfig);
  return data.getPostByPostName;
}

const UPDATE_POST_MUTATION = `
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      result {
        id
        postTitle
        postExcerpt
      }
      errors {
        message
        shortMessage
      }
    }
  }
`;
export async function updatePost(id, input, session) {
  const data = await _request(UPDATE_POST_MUTATION, { id, input }, session);
  if (data.updatePost.errors && data.updatePost.errors.length > 0) {
    throw new Error(data.updatePost.errors[0].message);
  }
  return data.updatePost.result;
}

const DESTROY_POST_MUTATION = `
  mutation DestroyPost($id: ID!) {
    destroyPost(id: $id) {
      result {
        id
      }
      errors {
        message
        shortMessage
      }
    }
  }
`;
export async function destroyPost(id, session) {
  const data = await _request(DESTROY_POST_MUTATION, { id }, session);
  if (data.destroyPost.errors && data.destroyPost.errors.length > 0) {
    throw new Error(data.destroyPost.errors[0].message);
  }
  return data.destroyPost.result;
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