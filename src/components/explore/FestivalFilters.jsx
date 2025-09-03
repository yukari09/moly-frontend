import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon } from "lucide-react";

const countries = [
  { name: "Japan", code: "jp" },
  { name: "India", code: "in" },
  { name: "Spain", code: "es" },
  { name: "Brazil", code: "br" },
  { name: "Italy", code: "it" },
  { name: "Mexico", code: "mx" },
];

const types = ["Music", "Food & Drink", "Cultural", "Arts", "Religious"];

export default function FestivalFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Festivals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search festivals..." className="pl-8" />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Pick a date range</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Country Select */}
        <div className="space-y-2">
          <Label>Country</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Checkboxes */}
        <div className="space-y-2">
          <Label>Type</Label>
          <div className="space-y-2">
            {types.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`type-${type}`} />
                <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <Input placeholder="Search by tag..." />
        </div>

      </CardContent>
    </Card>
  );
}