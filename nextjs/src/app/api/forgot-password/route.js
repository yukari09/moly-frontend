import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmail } from '@/lib/email';
import { ResetPasswordTemplate } from '@/emails/ResetPasswordTemplate';

export async function POST(request) {
  const { email, turnstileToken } = await request.json();

  if (!email || !turnstileToken) {
    return NextResponse.json({ error: 'Email and Turnstile token are required' }, { status: 400 });
  }

  // 1. Verify the Turnstile token
  const isTokenValid = await verifyTurnstileToken(turnstileToken);
  if (!isTokenValid) {
    return NextResponse.json({ error: 'Invalid Turnstile token. Please try again.' }, { status: 400 });
  }

  const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL;

  // 2. Call the GraphQL mutation to get a reset token
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

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generateTokenMutation),
    });

    const data = await res.json();

    const resetToken = data.data?.generateResetToken;
    const error = data.errors?.[0]?.message;

    // If there's an error OR if the token is null/empty (e.g., user not found),
    // we don't throw an error to the client to prevent email enumeration.
    // We just won't send an email.
    if (error || !resetToken) {
      console.error("Could not generate reset token:", error || "Token was null.");
      // Still return a generic success message.
      return NextResponse.json({ message: 'Password reset process initiated.' });
    }

    // 3. If we got a token, create the link and send the email
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    sendEmail({
      to: email,
      subject: `Reset your password for ${process.env.APP_NAME}`,
      react: <ResetPasswordTemplate
                name={email} // We don't have the user's name here, so we use email
                resetLink={resetLink}
                appName={process.env.APP_NAME || "Your App"}
             />
    }).catch(console.error);

    return NextResponse.json({ message: 'Password reset email sent.' });

  } catch (error) {
    console.error("Forgot password API error:", error);
    // Even in case of a network or other unexpected error, return a generic response.
    return NextResponse.json({ message: 'Password reset process initiated.' });
  }
}