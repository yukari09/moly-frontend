"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SessionDebugPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/debug/session");
    },
  });

  // This page should only be accessible in development
  if (process.env.NODE_ENV !== "development") {
    return (
      <main className="max-w-screen-xl mx-auto px-6 py-24">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only available in the development environment.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-24">
      <Card>
        <CardHeader>
          <CardTitle>Session Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
