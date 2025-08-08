import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from "@/lib/logger";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  logger.info("Update profile request body:", body);

  // The body is expected to be an array of { metaKey, metaValue } objects
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid input format. Expected an array.' }, { status: 400 });
  }

  const updateUserMetaMutation = {
    query: `
      mutation UpdateUserMeta($userMeta: [UserMetaInput!]) {
        updateUserMeta(userMeta: $userMeta) {
          id
          email
          userMeta {
            id
            metaKey
            metaValue
          }
        }
      }
    `,
    variables: {
      userMeta: body,
    },
  };

  try {
    const res = await fetch(process.env.GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(updateUserMetaMutation),
    });

    const data = await res.json();
    logger.info("GraphQL response for profile update:", data);

    if (!res.ok || data.errors) {
      const errorMessage = data.errors?.[0]?.message || "Failed to update profile.";
      return NextResponse.json({ error: errorMessage }, { status: res.status === 200 ? 400 : res.status });
    }

    // Assuming the mutation returns the updated User object
    return NextResponse.json({ user: data.data.updateUserMeta });

  } catch (error) {
    logger.error("Error in /api/user/update:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}