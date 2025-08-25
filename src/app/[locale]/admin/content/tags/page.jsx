'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Link from 'next/link';

function TagsPageClient() {
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});

  const [filterField, setFilterField] = useState(searchParams.get('filter_field') || 'name');
  const [filterValue, setFilterValue] = useState(searchParams.get('filter_value') || '');
  const [after, setAfter] = useState(searchParams.get('after') || null);
  const [currentFilterValue, setCurrentFilterValue] = useState(filterValue);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set('first', '10');
    if (filterField && filterValue) {
      params.set('filter_field', filterField);
      params.set('filter_value', filterValue);
    }
    if (after) {
      params.set('after', after);
    }

    try {
      const response = await fetch(`/api/admin/tags?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.edges.map(edge => edge.node));
      setPageInfo(result.pageInfo);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }, [filterField, filterValue, after]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setAfter(null);
    setFilterValue(currentFilterValue);
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.keys(rowSelection);
    if (idsToDelete.length === 0) return;

    try {
      const response = await fetch('/api/admin/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete tags.');
      }

      toast.success(`${idsToDelete.length} tag(s) deleted successfully.`);
      setRowSelection({});
      fetchData(); // Refetch data
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Button size="sm" asChild>
          <Link href="/admin/content/tags/new">New Tag</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <form onSubmit={handleFilterSubmit} className="flex items-center gap-2">
          <Select name="filter_field" defaultValue={filterField} onValueChange={setFilterField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="slug">Slug</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="filter_value"
            placeholder="Filter value..."
            value={currentFilterValue}
            onChange={(e) => setCurrentFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" disabled={isLoading}>Filter</Button>
        </form>
        
        {Object.keys(rowSelection).length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete ({Object.keys(rowSelection).length})</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected tags.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className={isLoading ? 'opacity-50 transition-opacity' : ''}>
        <DataTable 
          columns={columns} 
          data={data} 
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={() => setAfter(pageInfo.endCursor)} disabled={!pageInfo?.hasNextPage || isLoading}>
          Next Page
        </Button>
      </div>
    </div>
  );
}

export default function TagsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagsPageClient />
    </Suspense>
  )
}