import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { ResetPasswordTemplate } from '@/emails/ResetPasswordTemplate';
import { verifyTurnstileToken } from '@/lib/turnstile';
import logger from '@/lib/logger';
import { emailRateLimiter } from '@/lib/ratelimiter';
import * as gql from '@/lib/graphql';
import { getClientRealIp } from '@/lib/request';

export async function POST(request) {
  const ip = getClientRealIp(request);

  try {
    const { success } = await emailRateLimiter.limit(ip);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests.' }), { status: 429 });
    }

    const { email, turnstileToken } = await request.json();
    await verifyTurnstileToken(turnstileToken);

    try {
      const resetToken = await gql.generateResetToken(email);
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
      await sendEmail({
        to: email,
        subject: `Reset your ${process.env.APP_NAME} password`,
        react: <ResetPasswordTemplate resetLink={resetLink} />,
      });
    } catch (error) {
      // Suppress the error for security reasons to prevent email enumeration attacks.
      logger.error("Forgot password error (suppressed for security):", error.message);
    }

    // Always return a generic success message.
    return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });

  } catch (error) {
    logger.error("Error in /api/forgot-password:", error.message);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}
