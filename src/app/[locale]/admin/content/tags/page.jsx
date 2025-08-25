'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { listTermsOffset } from '@/lib/graphql';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import Link from 'next/link';

function TagsPageClient() {
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [bulkAction, setBulkAction] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  const [filterField, setFilterField] = useState(searchParams.get('filter_field') || 'name');
  const [filterValue, setFilterValue] = useState(searchParams.get('filter_value') || '');
  const [currentFilterValue, setCurrentFilterValue] = useState(filterValue);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const requestBody = {
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      filterField: filterField,
      filterValue: filterValue,
    };

    if (sorting.length > 0) {
      const sortFieldMapping = {
        'id': 'ID',
        'name': 'NAME',
        'slug': 'SLUG',
        'insertedAt': 'INSERTED_AT',
        'updatedAt': 'UPDATED_AT',
      };

      const sortParams = sorting.map(s => {
        const field = sortFieldMapping[s.id];
        if (!field) {
          console.error(`Unknown sort field: ${s.id}`);
          return null;
        }
        return {
          field: field,
          order: s.desc ? 'DESC' : 'ASC'
        };
      }).filter(Boolean);
      requestBody.sortParam = JSON.stringify(sortParams);
    }

    try {
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.results);
      setTotalCount(result.count);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }, [pagination, filterField, filterValue, sorting]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setPagination(p => ({ ...p, pageIndex: 0 }));
    setFilterValue(currentFilterValue);
  };

  const handleClearFilter = () => {
    setFilterField('name');
    setFilterValue('');
    setCurrentFilterValue('');
    setPagination(p => ({ ...p, pageIndex: 0 }));
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
      <div className="flex justify-between items-center mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Button size="sm" variant="secondary" asChild>
          <Link href="/admin/content/tags/new">New Tag</Link>
        </Button>
      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <Select 
            onValueChange={setBulkAction} 
            value={bulkAction} 
            disabled={Object.keys(rowSelection).length === 0}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Bulk Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            disabled={Object.keys(rowSelection).length === 0 || !bulkAction}
            variant="outline"
            onClick={() => {
              if (bulkAction === 'delete') {
                handleDeleteSelected();
              }
            }}
          >
            Apply
          </Button>
        </div>
        <div className="flex items-center justify-between">
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearFilter}
              disabled={isLoading || (!filterValue && filterField === 'name')}
            >
              Clear
            </Button>
          </form>
        </div>
      </div>

      <div className={isLoading ? 'opacity-50 transition-opacity' : ''}>
        <DataTable 
          columns={columns} 
          data={data} 
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          totalCount={totalCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
        />
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