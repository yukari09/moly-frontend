import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import logger from '@/lib/logger';
import { emailRateLimiter } from '@/lib/ratelimiter';
import { sendEmail } from "@/lib/email";
import { ResetPasswordTemplate } from "@/emails/ResetPasswordTemplate";
import { getClientRealIp } from '@/lib/request';
import { generateResetToken } from "@/lib/graphql";

export async function POST(request) {
  const ip = getClientRealIp(request);

  try {
    const { success } = await emailRateLimiter.limit(ip);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests.' }), { status: 429 });
    }

    const { email, turnstileToken } = await request.json();
    const cfVerifyResult = await verifyTurnstileToken(turnstileToken); 

    if(cfVerifyResult){
        return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }   
    try {

        const resetToken = await generateResetToken(email);
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: email,
            subject: `Reset your password ${process.env.APP_NAME}`,
            react: <ResetPasswordTemplate resetLink={resetLink} />
        });
    }catch(error){
        logger.error('Forgot Password:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Always return a generic success message.
    return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });

  } catch (error) {
    logger.error("Error in /api/forgot-password:", error.message);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}