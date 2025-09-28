'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export function DataTable({ columns, data, rowSelection, onRowSelectionChange, getRowId, totalCount, pagination, onPaginationChange, sorting, onSortingChange, emptyStateMessage = "No results.", refreshData }) {
  const [columnFilters, setColumnFilters] = React.useState([])

  const pageCount = totalCount ? Math.ceil(totalCount / pagination.pageSize) : -1;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: onRowSelectionChange,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: onPaginationChange,
    manualPagination: true,
    manualSorting: true,
    pageCount,
    getRowId,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta: {
      refreshData,
    }
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Total: {totalCount}</p>
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "} {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {(function() {
              const pageIndex = table.getState().pagination.pageIndex;
              const pageCount = table.getPageCount();
              const pageNumbers = [];

              if (pageCount <= 7) {
                for (let i = 0; i < pageCount; i++) {
                  pageNumbers.push(i);
                }
              } else {
                pageNumbers.push(0);
                if (pageIndex > 2) {
                  pageNumbers.push('...');
                }
                for (let i = Math.max(1, pageIndex - 1); i <= Math.min(pageCount - 2, pageIndex + 1); i++) {
                  pageNumbers.push(i);
                }
                if (pageIndex < pageCount - 3) {
                  pageNumbers.push('...');
                }
                pageNumbers.push(pageCount - 1);
              }

              return pageNumbers.map((page, index) => (
                <Button
                  key={index}
                  variant={page === pageIndex ? 'secondary' : 'outline'}
                  className="h-8 w-8 p-0"
                  onClick={() => typeof page === 'number' && table.setPageIndex(page)}
                  disabled={page === pageIndex || typeof page !== 'number'}
                >
                  {typeof page === 'number' ? page + 1 : page}
                </Button>
              ));
            })()}
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
