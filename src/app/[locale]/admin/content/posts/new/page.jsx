import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { listTermsOffset } from '@/lib/graphql';
import { PostForm } from '@/components/admin/post-form';

export default async function PostNewPage() {
  const session = await getServerSession(authOptions);

  // Fetch all categories and tags in parallel
  const [categoriesData, tagsData] = await Promise.all([
    listTermsOffset('category', 100, 0, null, session),
    listTermsOffset('post_tag', 100, 0, null, session)
  ]);

  return (
    <PostForm 
      allCategories={categoriesData.results || []}
      allTags={tagsData.results || []}
      title="Create New Post"
      description="Create a new post."
    />
  );
}


