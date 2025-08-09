import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from "@/lib/logger";

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

    const checkUsernameQuery = {
      query: `
        query IsNotUsernameAvailable($username: String!) {
          isNotUsernameAvailable(username: $username)
        }
      `,
      variables: {
        username: username,
      },
    };

    const res = await fetch(process.env.GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(checkUsernameQuery),
    });

    const data = await res.json();

    if (!res.ok || data.errors) {
      const errorMessage = data.errors?.[0]?.message || "Failed to check username.";
      logger.error("Username check failed:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ isNotAvailable: data.data.isNotUsernameAvailable });

  } catch (error) {
    logger.error("Error in /api/user/check-username:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}