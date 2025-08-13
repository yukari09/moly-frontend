import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;
  const verifyTokenMutation = {
    query: `
      mutation VerifyConfirmToken($token: String!, $purpose: String!) {
        verifyConfirmToken(token: $token, purpose: $purpose) {
          id
          email
        }
      }
    `,
    variables: {
      token: token,
      purpose: 'confirm_new_user',
    },
  };

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verifyTokenMutation),
    });

    const data = await res.json();

    // If the GraphQL response contains errors, or if the verifyConfirmToken field is null/missing, treat as failure.
    if (data.errors || !data.data || !data.data.verifyConfirmToken) {
      const errorMessage = data.errors?.[0]?.message || 'Invalid or expired token.';
      throw new Error(errorMessage);
    }

    // If we get a user object back (e.g., with an id), verification was successful.
    return NextResponse.json({ message: 'Email verified successfully' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
