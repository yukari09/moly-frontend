import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import * as gql from '@/lib/graphql';
import logger from '@/lib/logger';

export async function POST(request) {
  const { token, password, passwordConfirmation, turnstileToken } = await request.json();

  if (!token || !password || !passwordConfirmation || !turnstileToken) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    await verifyTurnstileToken(turnstileToken);

    if (password !== passwordConfirmation) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    await gql.resetPasswordWithToken(password, passwordConfirmation, token);

    return NextResponse.json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    logger.error("Error in /api/auth/reset-password:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
