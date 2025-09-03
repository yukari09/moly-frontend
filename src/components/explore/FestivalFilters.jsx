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

const categories = ["Music", "Food & Drink", "Cultural", "Arts"];
const tags = ["Family-Friendly", "Free Admission", "Once in a Lifetime"];

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

        {/* Categories Checkboxes */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`category-${category}`} />
                <Label htmlFor={`category-${category}`} className="font-normal">{category}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Checkboxes */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="space-y-2">
            {tags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox id={`tag-${tag}`} />
                <Label htmlFor={`tag-${tag}`} className="font-normal">{tag}</Label>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
