"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const socialLinksSchema = z.object({
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  x: z.string().url().optional().or(z.literal('')).refine((val) => !val || val.includes('x.com') || val.includes('twitter.com'), { message: "Please enter a valid X (Twitter) URL." }),
  github: z.string().url().optional().or(z.literal('')).refine((val) => !val || val.includes('github.com'), { message: "Please enter a valid GitHub URL." }),
  linkedin: z.string().url().optional().or(z.literal('')).refine((val) => !val || val.includes('linkedin.com'), { message: "Please enter a valid LinkedIn URL." }),
  facebook: z.string().url().optional().or(z.literal('')).refine((val) => !val || val.includes('facebook.com'), { message: "Please enter a valid Facebook URL." }),
});

export default function SocialLinksPage() {
  const { data: session, update: updateSession } = useSession();

  // @ts-ignore
  const userMeta = session?.user?.userMeta;

  const form = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      website: getMetaValue(userMeta, "website") || "",
      x: getMetaValue(userMeta, "x") || "",
      github: getMetaValue(userMeta, "github") || "",
      linkedin: getMetaValue(userMeta, "linkedin") || "",
      facebook: getMetaValue(userMeta, "facebook") || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      const userMetaPayload = Object.entries(values).map(([key, value]) => ({ metaKey: key, metaValue: value }));

      logger.info("Submitting social links update:", userMetaPayload);

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMetaPayload),
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "An error occurred.");

      const updatedUserMeta = result.user.userMeta;
      await updateSession({ user: { userMeta: updatedUserMeta } });

      toast.success("Social links updated successfully!");
      form.reset(values);

    } catch (error) {
      toast.error(error.message || "Failed to update social links.");
    }
  };
  
  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Links</h3>
        <p className="text-sm text-muted-foreground">Add links to your website and social media profiles.</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField control={form.control} name="website" render={({ field }) => (<FormItem><Label>Website</Label><FormControl><Input placeholder="https://your-website.com" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="x" render={({ field }) => (<FormItem><Label>X (Twitter)</Label><FormControl><Input placeholder="https://x.com/username" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="github" render={({ field }) => (<FormItem><Label>GitHub</Label><FormControl><Input placeholder="https://github.com/username" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><Label>LinkedIn</Label><FormControl><Input placeholder="https://linkedin.com/in/username" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="facebook" render={({ field }) => (<FormItem><Label>Facebook</Label><FormControl><Input placeholder="https://facebook.com/username" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}