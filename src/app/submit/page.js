"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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

export default function SubmitPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/submit");
    },
  });

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
            Your account is not active. Please contact support to activate your
            account before submitting a website.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
    // Here you would typically call a GraphQL mutation to submit the data
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Moly"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://moly.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what your website does."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="use-case">Use Case</Label>
              <Select name="useCase" required>
                <SelectTrigger id="use-case">
                  <SelectValue placeholder="Select a use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="ecommerce">Ecommerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Submit for Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
