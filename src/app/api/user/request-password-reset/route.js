import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import { sendEmail } from '@/lib/email';
import { ResetPasswordTemplate } from '@/emails/ResetPasswordTemplate';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, name } = session.user;

  try {
    const generateTokenMutation = {
      query: `
        mutation GenerateResetToken($email: String!) {
          generateResetToken(email: $email)
        }
      `,
      variables: {
        email: email,
      },
    };

    const res = await fetch(process.env.GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This mutation might not need auth, but sending it is safer
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(generateTokenMutation),
    });

    const data = await res.json();

    if (!res.ok || data.errors || !data.data.generateResetToken) {
      const errorMessage = data.errors?.[0]?.message || "Failed to generate reset token.";
      logger.error("Reset token generation failed:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const resetToken = data.data.generateResetToken;
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
