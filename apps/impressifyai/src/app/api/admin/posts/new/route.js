import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createPost } from '@/lib/graphql'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { postTitle, postContent, postExcerpt, categories, tags, postStatus } = body;

    if (!postTitle) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const input = {
      postTitle: postTitle,
      postContent: postContent,
      postExcerpt: postExcerpt,
      postStatus: postStatus || 'publish',
      postType: 'post',
      postDate: new Date().toISOString(),
    };

    if (categories && Array.isArray(categories)) {
      const validCategories = categories.filter(cat => cat);
      if (validCategories.length > 0) {
        input.categories = validCategories;
      }
    }

    if (tags && Array.isArray(tags)) {
      const validTags = tags.filter(tag => tag);
      if (validTags.length > 0) {
        input.tags = validTags;
      }
    }

    const newPost = await createPost(input, session);
    return NextResponse.json(newPost);
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
