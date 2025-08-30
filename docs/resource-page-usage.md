# Generic `ResourcePage` Component Usage

## Overview

The `ResourcePage` component is a generic, reusable template designed to rapidly create admin list pages for managing various resources (e.g., Tags, Posts, Users). It encapsulates all the common logic for data fetching, pagination, sorting, filtering, and bulk actions, allowing developers to create new admin pages by simply providing configuration files.

## How to Use

To create a new admin page for a resource (e.g., "Posts"), follow these steps:

### Step 1: Create a New Directory

Create a new directory for your resource under `src/app/[locale]/admin/content/`. For example:

```
src/app/[locale]/admin/content/posts/
```

### Step 2: Create `columns.jsx`

Inside the new directory, create a `columns.jsx` file. This file defines the columns for the data table using the `@tanstack/react-table` column definition format. It controls what data is displayed and how it is formatted.

**Example: `posts/columns.jsx`**
```jsx
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export const columns = [
  // Select Checkbox Column
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  // Data Columns
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
      </Button>
    ),
  },
  {
    accessorKey: 'author',
    header: 'Author',
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published At',
  },
];
```

### Step 3: Create `data-provider.js`

Next, create a `data-provider.js` file. This file encapsulates all API interactions for the resource.

**Example: `posts/data-provider.js`**
```javascript
export const postsDataProvider = {
  fetchData: async (params) => {
    const { limit, offset, filterField, filterValue, sortParam } = params;
    const requestBody = { limit, offset, filterField, filterValue, sortParam };

    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  },

  deleteData: async (ids) => {
    const response = await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete posts.');
    }
    return await response.json();
  },
};
```

### Step 4: Create `page.jsx`

Finally, create the `page.jsx` file. This file serves as the entry point and assembles the `ResourcePage` with its configurations.

**Example: `posts/page.jsx`**
```jsx
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
```

## Props API

The `<ResourcePage />` component accepts the following props:

| Prop              | Type     | Required | Description                                                                                                                                                           |
|-------------------|----------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns`         | `Array`  | Yes      | An array of column definitions for `@tanstack/react-table`. See `tags/columns.jsx` for a detailed example.                                                            |
| `dataProvider`    | `Object` | Yes      | An object with methods for data operations. It must provide `fetchData(params)` and `deleteData(ids)`. See `tags/data-provider.js` for a detailed example.         |
| `resourceName`    | `String` | Yes      | The singular name of the resource (e.g., "Tag", "Post"). Used for display purposes in titles and messages (e.g., "New Tag", "Tag deleted successfully").             |
| `newResourceLink` | `String` | Yes      | The URL path for the "New {resourceName}" button.                                                                                                                     |

## Complete Example: Tags Page

Here is the complete code for the refactored `tags` page, which serves as the primary example for this architecture.

### `src/app/[locale]/admin/content/tags/data-provider.js`
```javascript
export const tagsDataProvider = {
  fetchData: async (params) => {
    const { limit, offset, filterField, filterValue, sortParam } = params;
    const requestBody = { limit, offset, filterField, filterValue, sortParam };

    const response = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  },

  deleteData: async (ids) => {
    const response = await fetch('/api/admin/tags', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete tags.');
    }
    return await response.json();
  },
};
```

### `src/app/[locale]/admin/content/tags/columns.jsx`
```javascript
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'insertedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('insertedAt'))
      const formatted = date.toLocaleDateString()
      return <div className="font-medium">{formatted}</div>
    }
  },
]
```

### `src/app/[locale]/admin/content/tags/page.jsx`
```jsx
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
```
