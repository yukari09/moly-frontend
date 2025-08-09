import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import { sendEmail } from '@/lib/email';
import { EmailVerificationTemplate } from '@/emails/EmailVerificationTemplate';
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

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { email, name } = session.user;

    const generateTokenMutation = {
      query: `mutation GenerateConfirmToken($purpose: String!) { generateConfirmToken(purpose: $purpose) }`,
      variables: { purpose: "confirm_new_user" },
    };

    const res = await fetch(process.env.GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(generateTokenMutation),
    });

    const data = await res.json();
    if (!res.ok || data.errors || !data.data.generateConfirmToken) {
      const errorMessage = data.errors?.[0]?.message || "Failed to generate verification token.";
      logger.error("Verification token generation failed:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const verificationToken = data.data.generateConfirmToken;
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: `Verify your email for ${process.env.APP_NAME}`,
      react: <EmailVerificationTemplate name={name} verificationLink={verificationLink} />,
    });

    return NextResponse.json({ message: 'Verification email sent successfully.' });

  } catch (error) {
    logger.error("Error in /api/user/resend-verification:", error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
