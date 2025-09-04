import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPost, listTermsOffset } from '@/lib/graphql';
import { PostForm } from '@/components/admin/post-form';
import { notFound } from 'next/navigation';

export default async function PostEditPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  // Fetch all data in parallel on the server
  const [initialData, categoriesData, tagsData] = await Promise.all([
    getPost(id, session),
    listTermsOffset('category', 100, 0, null, session),
    listTermsOffset('post_tag', 200, 0, null, session)
  ]);

  if (!initialData) {
    notFound();
  }

  return (
    <PostForm 
      initialData={initialData}
      allCategories={categoriesData.results || []}
      allTags={tagsData.results || []}
      title="Edit Post"
      description="Edit an existing post."
    />
  );
}

