import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';

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

    const createPostMutation = {
      query: `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            result {
              id
              postName
            }
            errors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          postTitle: name,
          postContent: description,
          postStatus: "pending", // Default to pending for review
          postType: "site",     // Assuming 'site' is the post type for submitted websites
          postDate: new Date().toISOString(),
          categories: [{ name: useCase, taxonomyName: "category" }],
          postMeta: [
            { metaKey: "website_url", metaValue: url },
          ],
        },
      },
    };

    const res = await fetch(process.env.GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(createPostMutation),
    });

    const data = await res.json();
    logger.info("GraphQL response for site submission:", data);

    if (!res.ok || data.errors || data.data?.createPost?.errors?.length > 0) {
      const errorMessage = data.errors?.[0]?.message || data.data?.createPost?.errors?.[0]?.message || "Failed to submit site.";
      return NextResponse.json({ error: errorMessage }, { status: res.status === 200 ? 400 : res.status });
    }

    return NextResponse.json({ post: data.data.createPost.result });

  } catch (error) {
    logger.error("Error in /api/sites/submit:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
