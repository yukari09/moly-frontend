"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export default function PasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }

      toast.success("Password changed successfully! Please log in again.");
      
      await signOut({ callbackUrl: "/login" });

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you'll be logged out for security.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <Label htmlFor="current-password" className="col-span-1 text-right mt-2">Current Password</Label>
          <div className="col-span-2">
            <Input id="current-password" name="currentPassword" type="password" required disabled={isSubmitting} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Label htmlFor="new-password" className="col-span-1 text-right mt-2">New Password</Label>
          <div className="col-span-2">
            <Input id="new-password" name="newPassword" type="password" required disabled={isSubmitting} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Label htmlFor="confirm-password" className="col-span-1 text-right mt-2">Confirm New Password</Label>
          <div className="col-span-2">
            <Input id="confirm-password" name="confirmPassword" type="password" required disabled={isSubmitting} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
