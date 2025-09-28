'use client';

import { Suspense } from 'react';
import { ResourcePage } from '@/components/resource-page';
import { columns } from './columns';
import { usersDataProvider } from './data-provider';

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcePage 
        columns={columns}
        dataProvider={usersDataProvider}
        filterableFields={[{ value: 'name', label: 'Name' }, { value:'email', label: 'Email' }]}
        resourceName="User"
        newResourceLink="/admin/users/new"
    />
    </Suspense>
  );
}