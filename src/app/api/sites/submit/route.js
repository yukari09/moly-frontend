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
    const body = await request.json();
    const { name, url, description, useCase } = body;

    if (!name || !url || !description || !useCase) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const input = {
      postTitle: name,
      postContent: description,
      postStatus: "pending",
      postType: "site",
      postDate: new Date().toISOString(),
      categories: [{ name: useCase, taxonomyName: "category" }],
      postMeta: [
        { metaKey: "website_url", metaValue: url },
      ],
    };

    const result = await gql.createPost(input, session);

    return NextResponse.json({ post: result });

  } catch (error) {
    logger.error("Error in /api/sites/submit:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}