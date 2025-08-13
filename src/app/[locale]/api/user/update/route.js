import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import * as gql from '@/lib/graphql';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userMeta = await request.json();
    logger.info("Update profile request body:", userMeta);

    if (!Array.isArray(userMeta)) {
      return NextResponse.json({ error: 'Invalid input format. Expected an array.' }, { status: 400 });
    }

    const updatedUser = await gql.updateUserMeta(userMeta, session);

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    logger.error("Error in /api/user/update:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
