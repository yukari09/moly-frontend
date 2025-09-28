import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { listTermsOffset, createTerm, destroyTerm } from '@/lib/graphql'
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
    const { limit, offset, filterField, filterValue, sortParam } = body;

    let filter = null;
    if (filterField && filterValue) {
      filter = {
        [filterField]: { ilike: `${filterValue}%` }
      }
    }

    let sort = undefined;
    if (sortParam) {
      try {
        sort = JSON.parse(sortParam);
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid sort parameter' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    const categories = await listTermsOffset(
      'category',
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0,
      filter,
      session,
      sort,
      null,
      null
    )
    return NextResponse.json(categories);

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'IDs are required for deletion' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use Promise.all to wait for all deletions to complete
    const deletionPromises = ids.map(id => destroyTerm(id, session));
    const results = await Promise.all(deletionPromises);

    return NextResponse.json({ success: true, results });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
