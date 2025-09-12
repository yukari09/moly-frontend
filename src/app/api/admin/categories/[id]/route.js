import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getTerm, updateTerm } from '@/lib/graphql'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const term = await getTerm(id, "category", session);
    return NextResponse.json(term);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const term = await getTerm(id, 'category', session);
    const body = await req.json();
    const { name, slug, description, parentId, show_in_menu } = body;

    const input = {
      name: name,
      slug: slug,
      termMeta: [{ termKey: 'show_in_menu', termValue: show_in_menu ? '1' : '0' }],
      termTaxonomy: [
        {
          id: term.termTaxonomy[0].id,
          description: description || '',
          parent_id: parentId
        }
      ]
    };

    console.log(input)

    const updatedTerm = await updateTerm(id, input, session);
    return NextResponse.json(updatedTerm);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
