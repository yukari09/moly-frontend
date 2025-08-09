"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const submitSchema = z.object({
  name: z.string().min(1, "Website name is required.").max(100),
  url: z.string().url({ message: "Please enter a valid URL." }),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  useCase: z.string({ required_error: "Please select a use case." }),
});

export default function SubmitPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/submit");
    },
  });

  const form = useForm({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/sites/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "An unknown error occurred.");

      toast.success("Thank you! Your submission has been received and is pending review.");
      // Redirect to the homepage or a "thank you" page after successful submission
      router.push("/");

    } catch (error) {
      toast.error(error.message || "Failed to submit your website.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // @ts-ignore
  if (session && session.user?.status !== "active") {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-24">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Account Not Active</AlertTitle>
          <AlertDescription>
            Your account is not active. Please verify your email before submitting a website.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  const { isSubmitting } = form.formState;

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-24">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Submit a Website</CardTitle>
          <CardDescription>
            Fill out the form below to submit your website to our directory. It
            will be reviewed by our team before being published.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Website Name</Label>
                    <FormControl><Input placeholder="e.g. Moly" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <Label>Website URL</Label>
                    <FormControl><Input type="url" placeholder="https://moly.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <FormControl><Textarea placeholder="Describe what your website does." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="useCase"
                render={({ field }) => (
                  <FormItem>
                    <Label>Use Case</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a use case" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ai">AI</SelectItem>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="ecommerce">Ecommerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}