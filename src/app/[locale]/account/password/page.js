"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function PasswordPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLinkSent(false);

    try {
      const res = await fetch('/api/user/request-password-reset', {
        method: 'POST',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "An unknown error occurred.");

      toast.success("A password reset link has been sent to your email.");
      setLinkSent(true);

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
          Change your password by sending a reset link to your email.
        </p>
      </div>
      <Separator />
      {linkSent ? (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>
            A password reset link has been sent to <strong>{session?.user?.email}</strong>. Please follow the instructions in the email to set a new password.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Your verified email</Label>
            <p className="text-sm font-medium text-muted-foreground">{session?.user?.email}</p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </div>
  );
}
