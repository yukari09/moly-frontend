'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function ResourcePage({ columns, dataProvider, resourceName, newResourceLink }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [bulkAction, setBulkAction] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    pageIndex: searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10,
    sort: searchParams.get('sort'),
    sortDesc: searchParams.get('sortDesc') === 'true',
    filterField: searchParams.get('filterField') || 'name',
    filterValue: searchParams.get('filterValue') || '',
  });

  const debouncedFilterValue = useDebounce(filters.filterValue, 500);

  

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', filters.pageIndex + 1);
    params.set('pageSize', filters.pageSize);
    if (filters.sort) {
      params.set('sort', filters.sort);
      params.set('sortDesc', filters.sortDesc);
    }
    if (filters.filterField) {
      params.set('filterField', filters.filterField);
    }
    if (filters.filterValue) {
      params.set('filterValue', filters.filterValue);
    } else {
      params.delete('filterValue');
    }
    router.push(`?${params.toString()}`);
  }, [filters.pageIndex, filters.pageSize, filters.sort, filters.sortDesc, filters.filterField, filters.filterValue, router]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const sortParams = filters.sort ? [{
        field: filters.sort === 'insertedAt' ? 'INSERTED_AT' : filters.sort.toUpperCase(),
        order: filters.sortDesc ? 'DESC' : 'ASC'
      }] : undefined;

      const result = await dataProvider.fetchData({
        limit: filters.pageSize,
        offset: filters.pageIndex * filters.pageSize,
        filterField: filters.filterField,
        filterValue: debouncedFilterValue,
        sortParam: sortParams ? JSON.stringify(sortParams) : undefined,
      });

      setData(result.results);
      setTotalCount(result.count);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }, [dataProvider, filters.pageIndex, filters.pageSize, filters.sort, filters.sortDesc, filters.filterField, debouncedFilterValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setFilters(f => ({ ...f, pageIndex: 0 }));
  };

  const handleClearFilter = () => {
    setFilters(f => ({
      ...f,
      filterField: 'name',
      filterValue: '',
      pageIndex: 0,
    }));
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.keys(rowSelection);
    if (idsToDelete.length === 0) return;

    try {
      await dataProvider.deleteData(idsToDelete);
      toast.success(`${idsToDelete.length} ${resourceName}(s) deleted successfully.`);
      setRowSelection({});
      fetchData(); // Refetch data
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold">{resourceName}</h1>
        <Button size="sm" variant="secondary" asChild>
          <Link href={newResourceLink}>New {resourceName}</Link>
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
            <Select name="filter_field" defaultValue={filters.filterField} onValueChange={(value) => setFilters(f => ({ ...f, filterField: value }))}>
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
              value={filters.filterValue}
              onChange={(e) => setFilters(f => ({ ...f, filterValue: e.target.value }))}
              className="max-w-sm"
            />
            <Button type="submit" disabled={isLoading}>Filter</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearFilter}
              disabled={isLoading || (!filters.filterValue && filters.filterField === 'name')}
            >
              Clear
            </Button>
          </form>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div className={isLoading ? 'opacity-50 transition-opacity' : ''}>
          <DataTable 
            columns={columns} 
            data={data} 
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row.id}
            totalCount={totalCount}
            pagination={{
              pageIndex: filters.pageIndex,
              pageSize: filters.pageSize,
            }}
            onPaginationChange={(updater) => {
              setFilters(f => ({ ...f, ...updater(f) }));
            }}
            sorting={filters.sort ? [{ id: filters.sort, desc: filters.sortDesc }] : []}
            onSortingChange={(updater) => {
              const newSorting = updater(filters.sort ? [{ id: filters.sort, desc: filters.sortDesc }] : []);
              if (newSorting.length === 0) {
                setFilters(f => ({ ...f, sort: null, sortDesc: false }));
              } else {
                setFilters(f => ({ ...f, sort: newSorting[0].id, sortDesc: newSorting[0].desc }));
              }
            }}
            emptyStateMessage={`No ${resourceName} found. Try adjusting your filters.`}
          />
        </div>
      </div>
    </div>
  );
}
