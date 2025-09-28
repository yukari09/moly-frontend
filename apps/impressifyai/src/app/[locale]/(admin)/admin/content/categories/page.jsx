'use client';

import { Suspense } from 'react';
import { ResourcePage } from '@/components/resource-page';
import { columns } from './columns';
import { categoriesDataProvider } from './data-provider';

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcePage 
        columns={columns}
        dataProvider={categoriesDataProvider}
        resourceName="Category"
        newResourceLink="/admin/content/categories/new"
      />
    </Suspense>
  );
}