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
    const { name, slug, description, parentId, show_in_menu } = body;

    if (!name || !slug) {
      return new Response(JSON.stringify({ error: 'Name and Slug are required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const input = {
      name: name,
      slug: slug,
      termMeta: [{ termKey: 'show_in_menu', termValue: show_in_menu ? '1' : '0' }],
      termTaxonomy: [
        {
          taxonomy: 'category',
          description: description || '',
          parent_id: parentId || null
        }
      ]
    };
    const newCategory = await createTerm(input, session);
    return NextResponse.json(newCategory);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
