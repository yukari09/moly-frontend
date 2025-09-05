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
import { useRef, useState } from "react";
import { submitContribution } from "@/app/actions"; // Use the Server Action

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  overview: z.string().optional(),
  country: z.string().min(2, { message: "Country is required." }),
  city: z.string().optional(),
  date: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date().optional(),
  }),
  type: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one type.",
  }),
  tags: z.string().optional(),
  officialWebsite: z.string().optional(),
  ticketInfo: z.string().optional(),
  venueDetails: z.string().optional(),
  scheduleHighlights: z.string().optional(),
  uniqueAspects: z.string().optional(),
  heroImage: z.object({
    file: z.any(),
    width: z.number(),
    height: z.number(),
    description: z.string().optional(),
  }).optional(),
  gallery: z.array(z.object({
    file: z.any(),
    width: z.number(),
    height: z.number(),
    description: z.string().optional(),
  })).optional(),
  storyContent: z.string().min(10, { message: "Story must be at least 10 characters." }),
  traditionsContent: z.string().optional(),
  travelerGuideContent: z.string().optional(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroImageRef = useRef(null);
  const galleryRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", overview: "", country: "", city: "",
      type: [], tags: "", officialWebsite: "",
      ticketInfo: "", venueDetails: "", scheduleHighlights: "", uniqueAspects: "",
      heroImage: null,
      gallery: [],
      email: "",
      storyContent: "", traditionsContent: "", travelerGuideContent: "",
      date: { from: undefined, to: undefined },
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    toast.info("Submitting your contribution...");

    const formData = new FormData();

    // Append all text fields
    Object.keys(values).forEach(key => {
      if (key !== 'heroImage' && key !== 'gallery' && key !== 'date' && key !== 'type' && values[key]) {
        formData.append(key, values[key]);
      }
    });

    // Append complex fields
    if (values.date) formData.append('date', JSON.stringify(values.date));
    if (values.type) formData.append('type', JSON.stringify(values.type));

    // Append hero image
    if (values.heroImage && values.heroImage.file) {
      formData.append('heroImage', values.heroImage.file);
      formData.append('heroImageMeta', JSON.stringify({
        width: values.heroImage.width,
        height: values.heroImage.height,
        description: values.heroImage.description,
      }));
    }

    // Append gallery images
    if (values.gallery && values.gallery.length > 0) {
      values.gallery.forEach((imgData, index) => {
        if (imgData.file) {
          formData.append(`gallery_${index}`, imgData.file);
          formData.append(`galleryMeta_${index}`, JSON.stringify({
            width: imgData.width,
            height: imgData.height,
            description: imgData.description,
          }));
        }
      });
    }

    try {
      const result = await submitContribution(formData);

      if (result.success) {
        toast.success("Submission Received!", {
          description: "Thank you for your contribution. We will review it shortly.",
        });
        form.reset();
      } else {
        toast.error("Submission Failed", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Submission Error", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

            <FormField control={form.control} name="overview" render={({ field }) => (
              <FormItem>
                <FormLabel>Overview</FormLabel>
                <FormControl><Textarea placeholder="A brief summary of the festival..." className="resize-y min-h-[80px]" {...field} /></FormControl>
                <FormDescription>A concise, high-level description of the festival.</FormDescription>
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
                  <FormLabel>City (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., Buñol" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
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

            <FormField control={form.control} name="officialWebsite" render={({ field }) => (
                <FormItem>
                    <FormLabel>Official Website (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., https://www.latomatina.info" {...field} /></FormControl>
                    <FormDescription>Link to the festival's official website or main information page.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="heroImage" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                        <div>
                            <input type="file" className="hidden" ref={heroImageRef} onChange={async (e) => {
                                const file = e.target.files ? e.target.files[0] : null;
                                if (file) {
                                    // Validate file size
                                    if (file.size > 2 * 1024 * 1024) { // 2MB
                                        toast.error("Image size exceeds 2MB limit.");
                                        return;
                                    }

                                    // Get dimensions
                                    const img = new Image();
                                    img.src = URL.createObjectURL(file);
                                    await new Promise(resolve => img.onload = resolve); // Wait for image to load

                                    field.onChange({
                                        file: file,
                                        width: img.width,
                                        height: img.height,
                                        description: "", // Placeholder for description
                                    });
                                    URL.revokeObjectURL(img.src); // Clean up
                                } else {
                                    field.onChange(null);
                                }
                            }} accept="image/*" />
                            <div className="flex items-center gap-4">
                                <Button type="button" variant="outline" onClick={() => heroImageRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Choose Image</Button>
                                {field.value && (
                                    <div className="relative w-32 h-32">
                                        <img src={URL.createObjectURL(field.value.file)} alt="Hero image preview" className="object-cover w-full h-full rounded-md" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => field.onChange(null)}><X className="h-4 w-4" /></Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="space-y-4 pt-4 border-t border-dashed">
                <h3 className="text-lg font-semibold">Additional Festival Details</h3>

                <FormField control={form.control} name="ticketInfo" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ticket & Cost Information (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Free entry, tickets required for main events, prices range from $X to $Y..." className="resize-y min-h-[80px]" {...field} /></FormControl>
                        <FormDescription>Details about entry fees, ticket prices, and where to purchase.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="venueDetails" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Venue & Location Details (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Held in Plaza del Pueblo, main events at X Park, accessible via Y metro line..." className="resize-y min-h-[80px]" {...field} /></FormControl>
                        <FormDescription>Specific locations, venues, and transportation tips.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="scheduleHighlights" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Schedule Highlights (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Opening ceremony on Day 1, main parade on Day 3, closing fireworks on Day 7..." className="resize-y min-h-[80px]" {...field} /></FormControl>
                        <FormDescription>Key events or a brief overview of the festival's program.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="uniqueAspects" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unique Aspects & Highlights (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Known for its giant puppets, features a unique traditional dance, only festival of its kind..." className="resize-y min-h-[80px]" {...field} /></FormControl>
                        <FormDescription>What makes this festival truly special or stand out.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

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
                            <input type="file" multiple className="hidden" ref={galleryRef} onChange={async (e) => {
                                const files = e.target.files ? Array.from(e.target.files) : [];
                                const currentImageCount = field.value?.length || 0;
                                const availableSlots = 8 - currentImageCount;

                                if (availableSlots <= 0) {
                                    toast.error("Gallery is full. Maximum 8 images allowed.");
                                    return;
                                }

                                const filesToProcess = files.slice(0, availableSlots);
                                if (files.length > availableSlots) {
                                    toast.info(`${files.length - availableSlots} images were not added because the gallery is full.`);
                                }

                                const validFiles = filesToProcess.filter(file => {
                                    if (file.size > 2 * 1024 * 1024) { // 2MB
                                        toast.error(`${file.name} size exceeds 2MB limit.`);
                                        return false;
                                    }
                                    return true;
                                });

                                const processedFiles = await Promise.all(validFiles.map(async (file) => {
                                    // Get dimensions
                                    const img = new Image();
                                    img.src = URL.createObjectURL(file);
                                    await new Promise(resolve => img.onload = resolve); // Wait for image to load

                                    const result = {
                                        file: file,
                                        width: img.width,
                                        height: img.height,
                                        description: "", // Placeholder for description
                                    };
                                    URL.revokeObjectURL(img.src); // Clean up
                                    return result;
                                }));
                                field.onChange([...(field.value || []), ...processedFiles]); // Append new valid files
                            }} accept="image/*" />
                            <Button type="button" variant="outline" onClick={() => galleryRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Choose Images</Button>
                            {field.value?.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {field.value.map((imgData, i) => (
                                        <div key={i} className="relative">
                                            <img src={URL.createObjectURL(imgData.file)} alt={`Gallery image ${i + 1}`} className="object-cover w-full h-24 rounded-md" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => {
                                                    const newGallery = [...field.value];
                                                    newGallery.splice(i, 1);
                                                    field.onChange(newGallery);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
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

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Contribution"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
