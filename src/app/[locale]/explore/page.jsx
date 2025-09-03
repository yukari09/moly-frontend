"use client";

import { useState } from "react";
import Link from "next/link";
import FestivalFilters from "@/components/explore/FestivalFilters";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Mock data and columns for the DataTable
const festivalData = [
  {
    id: 1,
    slug: "holi-festival",
    title: "Holi Festival",
    date: "2025-03-14",
    country: "India",
    type: ["Cultural", "Religious"],
    tags: ["Colors", "Spring", "Family-Friendly"],
  },
  {
    id: 2,
    slug: "oktoberfest",
    title: "Oktoberfest",
    date: "2025-09-20",
    country: "Germany",
    type: ["Food & Drink"],
    tags: ["Beer", "Traditional"],
  },
  {
    id: 3,
    slug: "gion-matsuri",
    title: "Gion Matsuri",
    date: "2025-07-01",
    country: "Japan",
    type: ["Cultural", "Historical"],
    tags: ["Parade", "Kyoto"],
  },
  {
    id: 4,
    slug: "labor-day",
    title: "Labor Day",
    date: "2025-09-01",
    country: "United States",
    type: ["Historical"],
    tags: ["Holiday", "Workers"],
  },
];

const columns = [
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => {
      const { slug, title } = row.original;
      return (
        <Link href={`/festival/${slug}`} className="font-medium text-primary hover:underline">
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const types = row.original.type;
      return (
        <div className="flex flex-wrap gap-1">
          {types.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
      );
    },
  },
];

// Helper function to compare dates without time
const areDatesTheSame = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export default function ExplorePage() {
  // State for DataTable
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // New state for calendar filtering
  const [selectedDate, setSelectedDate] = useState(null);

  // Transform data for FullCalendar
  const calendarEvents = festivalData.map(f => ({
    title: f.title,
    date: f.date,
    allDay: true,
  }));

  // Filter data for DataTable based on selectedDate
  const filteredData = selectedDate
    ? festivalData.filter(f => areDatesTheSame(new Date(f.date), selectedDate))
    : festivalData;

  // Handle date click on calendar
  const handleDateClick = (arg) => {
    // If the clicked date is the same as the currently selected date, deselect it.
    if (selectedDate && areDatesTheSame(arg.date, selectedDate)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(arg.date);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Filters */}
        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
          <FestivalFilters />
        </div>

        {/* Right Column: Calendar & Results */}
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardContent className="p-2 text-sm">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                dateClick={handleDateClick}
                headerToolbar={{
                  left: 'prev',
                  center: 'title',
                  right: 'next'
                }}
                height="auto"
                eventColor="hsl(var(--primary))"
                eventDisplay='list-item' // Use list-item for a cleaner look
              />
            </CardContent>
          </Card>

          <div>
            {selectedDate && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Festivals on {selectedDate.toLocaleDateString()}
                </h2>
                <Button variant="ghost" onClick={() => setSelectedDate(null)}>
                  Clear Selection
                </Button>
              </div>
            )}
            <DataTable 
              columns={columns} 
              data={filteredData} 
              emptyStateMessage={selectedDate ? "No festivals found for this date." : "No festivals found."}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              sorting={sorting}
              onSortingChange={setSorting}
              pagination={pagination}
              onPaginationChange={setPagination}
              totalCount={filteredData.length}
              getRowId={(row) => row.id}
            />
          </div>
        </div>

      </div>
    </div>
  );
}