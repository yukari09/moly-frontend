import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { ResetPasswordTemplate } from '@/emails/ResetPasswordTemplate';
import { verifyTurnstileToken } from '@/lib/turnstile';
import logger from '@/lib/logger';
import { emailRateLimiter } from '@/lib/ratelimiter';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

  try {
    const { success } = await emailRateLimiter.limit(ip);
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429 }
      );
    }

    const { email, turnstileToken } = await request.json();

    const isTokenValid = await verifyTurnstileToken(turnstileToken);
    if (!isTokenValid) {
      return NextResponse.json({ error: "Invalid Turnstile token. Please try again." }, { status: 400 });
    }

    const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;
    const generateTokenMutation = {
      query: `mutation GenerateResetToken($email: String!) { generateResetToken(email: $email) }`,
      variables: { email },
    };

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generateTokenMutation),
    });

    const data = await res.json();

    if (!res.ok || data.errors || !data.data.generateResetToken) {
      logger.error("Forgot password error (suppressed for security):", data.errors?.[0]?.message);
      return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    const resetToken = data.data.generateResetToken;
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: `Reset your ${process.env.APP_NAME} password`,
      react: <ResetPasswordTemplate resetLink={resetLink} />,
    });

    return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });

  } catch (error) {
    logger.error("Error in /api/forgot-password:", error.message);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}