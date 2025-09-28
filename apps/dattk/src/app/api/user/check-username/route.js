import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from "@/lib/logger";
import * as gql from '@/lib/graphql';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const isNotAvailable = await gql.isUsernameAvailable(username, session);

    return NextResponse.json({ isNotAvailable });

  } catch (error) {
    logger.error("Error in /api/user/check-username:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
