import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getPost, updatePost } from '@/lib/graphql'
import { NextResponse } from 'next/server'

export async function GET(req, context) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const post = await getPost(params.id, session);
    return NextResponse.json(post);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req, context) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { postTitle, postContent, categories, tags } = body;

    const input = {
      postTitle: postTitle,
      postContent: postContent,
      categories: categories,
      tags: tags,
    };

    const updatedPost = await updatePost(params.id, input, session);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
