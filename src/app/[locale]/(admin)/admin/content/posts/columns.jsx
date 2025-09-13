'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { postsDataProvider } from './data-provider';

const ActionsCell = ({ row, table }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const post = row.original;

  const handleDelete = async () => {
    try {
      await postsDataProvider.deleteData([post.id]);
      toast.success('Post deleted successfully.');
      if (table.options.meta?.refreshData) {
        table.options.meta.refreshData();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete post.');
    }
  };

  return (
    <>
      <ConfirmDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        title="Are you sure you want to delete this post?"
        description="This action cannot be undone. This will permanently delete the post."
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/post/${post.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

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
    accessorKey: 'postTitle',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: 'categories',
    header: 'Category',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.categories?.[0]?.name}</div>
    }
  },
  {
    accessorKey: 'post_tags',
    header: 'Tags',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.postTags?.map(tag => tag.name).join(", ") || ""}</div>
    }
  },
  {
    accessorKey: 'postStatus',
    header: 'Status',
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
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('insertedAt'))
      const formatted = date.toLocaleDateString()
      return <div className="font-medium">{formatted}</div>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: (props) => <ActionsCell {...props} />,
  },
]