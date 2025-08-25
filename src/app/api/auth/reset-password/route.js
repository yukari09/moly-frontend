import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request) {
  const { token, password, passwordConfirmation, turnstileToken } = await request.json();

  if (!token || !password || !passwordConfirmation || !turnstileToken) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // 1. Verify the Turnstile token
  const isTurnstileTokenValid = await verifyTurnstileToken(turnstileToken);
  if (!isTurnstileTokenValid) {
    return NextResponse.json({ error: 'Invalid Turnstile token. Please try again.' }, { status: 400 });
  }

  if (password !== passwordConfirmation) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;
  const resetPasswordMutation = {
    query: `
      mutation ResetPasswordWithToken($resetToken: String!, $password: String!, $passwordConfirmation: String!) {
        resetPasswordWithToken(resetToken: $resetToken, password: $password, passwordConfirmation: $passwordConfirmation) {
          id
          email
        }
      }
    `,
    variables: {
      resetToken: token,
      password,
      passwordConfirmation,
    },
  };

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resetPasswordMutation),
    });

    const data = await res.json();

    if (data.errors || !data.data.resetPasswordWithToken) {
      const errorMessage = data.errors?.[0]?.message || 'Failed to reset password. The token may be invalid or expired.';
      throw new Error(errorMessage);
    }

    return NextResponse.json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}