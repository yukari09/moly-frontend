'use client';

import { Suspense } from 'react';
import { ResourcePage } from '@/components/resource-page';
import { columns } from './columns';
import { tagsDataProvider } from './data-provider';

export default function TagsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcePage 
        columns={columns}
        dataProvider={tagsDataProvider}
        resourceName="Tag"
        newResourceLink="/admin/content/tags/new"
      />
    </Suspense>
  );
}