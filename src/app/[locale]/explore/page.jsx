"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FestivalFilters from "@/components/explore/FestivalFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";

// FullCalendar styles are handled automatically by the library since v6
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Mock data with images
const festivalData = [
  {
    id: 1,
    slug: "holi-festival",
    title: "Holi Festival",
    date: "2025-03-14",
    country: "India",
    type: ["Cultural", "Religious"],
    tags: ["Colors", "Spring", "Family-Friendly"],
    image: "https://placehold.co/400x250/F44336/FFFFFF?text=Holi",
  },
  {
    id: 2,
    slug: "oktoberfest",
    title: "Oktoberfest",
    date: "2025-09-20",
    country: "Germany",
    type: ["Food & Drink"],
    tags: ["Beer", "Traditional"],
    image: "https://placehold.co/400x250/3F51B5/FFFFFF?text=Oktoberfest",
  },
  {
    id: 3,
    slug: "gion-matsuri",
    title: "Gion Matsuri",
    date: "2025-07-01",
    country: "Japan",
    type: ["Cultural", "Historical"],
    tags: ["Parade", "Kyoto"],
    image: "https://placehold.co/400x250/4CAF50/FFFFFF?text=Gion+Matsuri",
  },
  {
    id: 4,
    slug: "labor-day",
    title: "Labor Day",
    date: "2025-09-01",
    country: "United States",
    type: ["Historical"],
    tags: ["Holiday", "Workers"],
    image: "https://placehold.co/400x250/FF9800/FFFFFF?text=Labor+Day",
  },
];

// Helper function to compare dates without time
const areDatesTheSame = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default function ExplorePage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // Default to list view

  // Transform data for FullCalendar
  const calendarEvents = festivalData.map((f) => ({
    title: f.title,
    date: f.date,
    allDay: true,
  }));

  // Filter data for the list based on selectedDate
  const filteredData = selectedDate
    ? festivalData.filter((f) => areDatesTheSame(new Date(f.date), selectedDate))
    : festivalData;

  // Handle date click on calendar
  const handleDateClick = (arg) => {
    if (selectedDate && areDatesTheSame(arg.date, selectedDate)) {
      setSelectedDate(null); // Deselect if clicking the same date
    } else {
      setSelectedDate(arg.date);
      setActiveTab("list"); // Switch to list view on new date selection
    }
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Filters */}
        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
          <FestivalFilters />
        </div>

        {/* Right Column: Tabs for Calendar & List */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-4">
              <Card>
                <CardContent className="p-2 text-sm">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    dateClick={handleDateClick}
                    headerToolbar={{
                      left: "prev",
                      center: "title",
                      right: "next",
                    }}
                    height="auto"
                    eventColor="hsl(var(--primary))"
                    eventDisplay="list-item"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <div className="space-y-6">
                {selectedDate && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      Festivals on {selectedDate.toLocaleDateString()}
                    </h2>
                    <Button variant="ghost" onClick={clearFilter}>
                      Clear Selection & Show All
                    </Button>
                  </div>
                )}

                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredData.map((festival) => (
                      <Card
                        key={festival.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <Link href={`/festival/${festival.slug}`} className="block">
                          <div className="relative h-40 w-full">
                            <Image
                              src={festival.image}
                              alt={festival.title}
                              fill
                              className="object-cover"
                              unoptimized // for placeholder service
                            />
                          </div>
                          <CardHeader>
                            <CardTitle>{festival.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                festival.date
                              ).toLocaleDateString()}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              {festival.country}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {festival.type.map((t) => (
                                <Badge key={t} variant="secondary">
                                  {t}
                                </Badge>
                              ))}
                              {festival.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">No Festivals Found</h3>
                    <p className="text-muted-foreground">
                      {
                        selectedDate
                          ? "There are no festivals scheduled for this date."
                          : "Try adjusting your filters."
                      }
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
