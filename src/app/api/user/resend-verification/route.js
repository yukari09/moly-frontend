import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import { sendEmail } from '@/lib/email';
import { EmailVerificationTemplate } from '@/emails/EmailVerificationTemplate';
import * as gql from '@/lib/graphql';
import { emailRateLimiter } from '@/lib/ratelimiter';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

  try {
    const { success } = await emailRateLimiter.limit(ip);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests.' }), { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { email, name } = session.user;

    const verificationToken = await gql.generateConfirmToken("confirm_new_user", session);
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: `Verify your email for ${process.env.APP_NAME}`,
      react: <EmailVerificationTemplate name={name} verificationLink={verificationLink} />,
    });

    return NextResponse.json({ message: 'Verification email sent successfully.' });

  } catch (error) {
    logger.error("Error in /api/user/resend-verification:", error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}