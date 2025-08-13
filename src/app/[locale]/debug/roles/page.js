"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Terminal, Shield, User } from "lucide-react";
import { hasRole, hasAnyRole, isAdmin, isModerator, getUserRoles } from "@/lib/auth";

export default function RolesDebugPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/debug/roles");
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

  const userRoles = getUserRoles(session);

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-24">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Roles Debug
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current User Roles:</h3>
              <div className="flex gap-2 flex-wrap">
                {userRoles.length > 0 ? (
                  userRoles.map(role => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">No roles assigned</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Role Checks:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Is Admin:</span>
                    <Badge variant={isAdmin(session) ? "default" : "secondary"}>
                      {isAdmin(session) ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Is Moderator:</span>
                    <Badge variant={isModerator(session) ? "default" : "secondary"}>
                      {isModerator(session) ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Has 'user' role:</span>
                    <Badge variant={hasRole(session, 'user') ? "default" : "secondary"}>
                      {hasRole(session, 'user') ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">User Info:</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>ID:</strong> {session.user.id}</div>
                  <div><strong>Email:</strong> {session.user.email}</div>
                  <div><strong>Status:</strong> {session.user.status}</div>
                  <div><strong>Username:</strong> {session.user.username || 'Not set'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Raw Session Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}