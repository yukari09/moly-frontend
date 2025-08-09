"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});

export default function PasswordPage() {
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "An unknown error occurred.");

      toast.success("Password changed successfully! Please log in again.");
      
      await signOut({ callbackUrl: "/login" });

    } catch (error) {
      toast.error(error.message);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you'll be logged out for security.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <Label>Current Password</Label>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <Label>New Password</Label>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label>Confirm New Password</Label>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}