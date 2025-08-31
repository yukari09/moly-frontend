'use client';

import { Suspense } from 'react';
import { ResourcePage } from '@/components/resource-page';
import { columns } from './columns';
import { postsDataProvider } from './data-provider';

export default function PostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcePage 
        columns={columns}
        dataProvider={postsDataProvider}
        resourceName="Post"
        newResourceLink="/admin/content/posts/new"
      />
    </Suspense>
  );
}