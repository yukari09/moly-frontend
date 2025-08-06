import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from "crypto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is missing.' }, { status: 400 });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: hashedToken },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 400 });
    }

    if (new Date() > new Date(user.verificationTokenExpires)) {
      return NextResponse.json({ error: 'Token has expired.' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Email verified successfully.' });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
