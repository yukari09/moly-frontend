import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createTerm } from '@/lib/graphql'
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
    const { name, slug, description } = body;

    if (!name || !slug) {
      return new Response(JSON.stringify({ error: 'Name and Slug are required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const input = {
      name: name,
      slug: slug,
      termTaxonomy: [
        {
          taxonomy: 'post_tag',
          description: description || ''
        }
      ]
    };
    const newTag = await createTerm(input, session);
    return NextResponse.json(newTag);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}