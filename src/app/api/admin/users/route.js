import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { listUsersOffset } from '@/lib/graphql'
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
    const { limit, offset, filterField, filterValue, sortParam, defaultFilter} = body;

    // Start with the mandatory filter for postType
    let filter = {};

    // Add user-defined filters
    if (filterField && filterValue) {
      filter[filterField] = { like: `%${filterValue}%` };
    }

    if(defaultFilter){
      const [defaultFilterField, defaultFilterValue] = defaultFilter;
      if (![false, null, "","all"].includes(defaultFilterValue)){
        filter[defaultFilterField] = { eq: defaultFilterValue };
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

    const posts = await listUsersOffset(
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0,
      filter,
      sort,
      session
    )
    return NextResponse.json(posts);

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// export async function DELETE(req) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
//       status: 401,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }

//   try {
//     const body = await req.json();
//     const { ids } = body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return new Response(JSON.stringify({ error: 'IDs are required for deletion' }), { 
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Use Promise.all to wait for all deletions to complete
//     const deletionPromises = ids.map(id => destroyPost(id, session));
//     const results = await Promise.all(deletionPromises);

//     return NextResponse.json({ success: true, results });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }