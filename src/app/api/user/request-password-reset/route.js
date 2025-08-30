import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import { sendEmail } from '@/lib/email';
import { ResetPasswordTemplate } from '@/emails/ResetPasswordTemplate';
import * as gql from '@/lib/graphql';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, name } = session.user;

  try {
    const resetToken = await gql.generateResetToken(email);
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send the password reset email
    await sendEmail({
      to: email,
      subject: `Reset your ${process.env.APP_NAME} password`,
      react: <ResetPasswordTemplate name={name} resetLink={resetLink} />,
    });

    return NextResponse.json({ message: 'Password reset link sent successfully.' });

  } catch (error) {
    logger.error("Error in /api/user/request-password-reset:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}