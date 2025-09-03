"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRef } from "react";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  city: z.string().min(2, { message: "City is required." }),
  date: z.date({ required_error: "A date is required." }),
  type: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one type.",
  }),
  tags: z.string().optional(),
  heroImage: z.any().optional(),
  storyContent: z.string().optional(),
  traditionsContent: z.string().optional(),
  travelerGuideContent: z.string().optional(),
  gallery: z.any().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
});

const countries = [
    { name: "Argentina", code: "ar" }, { name: "Australia", code: "au" }, { name: "Brazil", code: "br" },
    { name: "Canada", code: "ca" }, { name: "China", code: "cn" }, { name: "Egypt", code: "eg" },
    { name: "France", code: "fr" }, { name: "Germany", code: "de" }, { name: "Greece", code: "gr" },
    { name: "India", code: "in" }, { name: "Ireland", code: "ie" }, { name: "Italy", code: "it" },
    { name: "Japan", code: "jp" }, { name: "Mexico", code: "mx" }, { name: "Morocco", code: "ma" },
    { name: "Netherlands", code: "nl" }, { name: "New Zealand", code: "nz" }, { name: "Peru", code: "pe" },
    { name: "Portugal", code: "pt" }, { name: "South Africa", code: "za" }, { name: "South Korea", code: "kr" },
    { name: "Spain", code: "es" }, { name: "Switzerland", code: "ch" }, { name: "Thailand", code: "th" },
    { name: "Turkey", code: "tr" }, { name: "United Kingdom", code: "gb" }, { name: "United States", code: "us" },
    { name: "Vietnam", code: "vn" },
];

const festivalTypes = [
    { id: "Cultural", label: "Cultural" }, { id: "Religious", label: "Religious" },
    { id: "Music", label: "Music" }, { id: "Food & Drink", label: "Food & Drink" },
    { id: "Arts", label: "Arts" },
];

export default function ContributeForm() {
  const heroImageRef = useRef(null);
  const galleryRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", country: "", city: "",
      type: [], tags: "", email: "",
      storyContent: "", traditionsContent: "", travelerGuideContent: "",
    },
  });

  function onSubmit(values) {
    console.log(values);
    toast.success("Submission Received!", {
      description: "Thank you for your contribution. We will review it shortly.",
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Festival</CardTitle>
        <CardDescription>Fill out the form below to contribute to DayCal.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="e.g., La Tomatina" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                    <SelectContent>{countries.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl><Input placeholder="e.g., Buñol" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Festival</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="type" render={() => (
              <FormItem>
                <div className="mb-4"><FormLabel>Type</FormLabel><FormDescription>Select all types that apply.</FormDescription></div>
                {festivalTypes.map((item) => (
                  <FormField key={item.id} control={form.control} name="type" render={({ field }) => (
                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.id])
                              : field.onChange(field.value?.filter((value) => value !== item.id));
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item.label}</FormLabel>
                    </FormItem>
                  )} />
                ))}
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl><Input placeholder="e.g., Family-Friendly, Outdoors, Art" {...field} /></FormControl>
                    <FormDescription>Separate tags with a comma.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="heroImage" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                        <div>
                            <input type="file" className="hidden" ref={heroImageRef} onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} accept="image/*" />
                            <div className="flex items-center gap-4">
                                <Button type="button" variant="outline" onClick={() => heroImageRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Choose Image</Button>
                                {field.value && <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>{field.value.name}</span><Button type="button" variant="ghost" size="icon" onClick={() => field.onChange(null)}><X className="h-4 w-4" /></Button></div>}
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="space-y-4">
                <FormLabel>Content Sections</FormLabel>
                <FormField control={form.control} name="storyContent" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-normal text-muted-foreground">Story</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Tell us the story behind the festival..." className="resize-y min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="traditionsContent" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-normal text-muted-foreground">Traditions</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the traditions, rituals, and activities..." className="resize-y min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="travelerGuideContent" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-normal text-muted-foreground">Traveler's Guide</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Provide tips for travelers attending the festival..." className="resize-y min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="gallery" render={({ field }) => (
                <FormItem>
                    <FormLabel>Gallery Images</FormLabel>
                    <FormControl>
                        <div>
                            <input type="file" multiple className="hidden" ref={galleryRef} onChange={(e) => field.onChange(e.target.files ? Array.from(e.target.files) : [])} accept="image/*" />
                            <Button type="button" variant="outline" onClick={() => galleryRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Choose Images</Button>
                            {field.value?.length > 0 && <div className="mt-2 space-y-2">{field.value.map((file, i) => <div key={i} className="text-sm text-muted-foreground">{file.name}</div>)}</div>}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email (Optional)</FormLabel>
                <FormControl><Input placeholder="So we can credit you or ask questions" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit">Submit Contribution</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
