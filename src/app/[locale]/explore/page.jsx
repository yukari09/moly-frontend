"use client";

import { useState } from "react";
import FestivalFilters from "@/components/explore/FestivalFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/ui/data-table";

// Mock data and columns for the DataTable
const festivalData = [
  { id: 1, name: "Holi Festival", date: "2025-03-14", country: "India" },
  { id: 2, name: "Oktoberfest", date: "2025-09-20", country: "Germany" },
  { id: 3, name: "Gion Matsuri", date: "2025-07-01", country: "Japan" },
];

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "country", header: "Country" },
];

export default function ExplorePage() {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Column: Filters */}
        <aside className="md:col-span-1">
          <FestivalFilters />
        </aside>

        {/* Right Column: Results */}
        <main className="md:col-span-3">
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
              <Card>
                <CardContent className="p-0">
                  <Calendar className="w-full" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="list">
               <DataTable 
                 columns={columns} 
                 data={festivalData} 
                 emptyStateMessage="No festivals found."
                 rowSelection={rowSelection}
                 onRowSelectionChange={setRowSelection}
                 sorting={sorting}
                 onSortingChange={setSorting}
                 pagination={pagination}
                 onPaginationChange={setPagination}
                 totalCount={festivalData.length}
                 getRowId={(row) => row.id}
               />
            </TabsContent>
          </Tabs>
        </main>

      </div>
    </div>
  );
}