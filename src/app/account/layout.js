"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function SidebarNav({ className, ...props }) {
  const pathname = usePathname();
  const items = [
    {
      href: "/account/profile",
      title: "Profile",
    },
    {
      href: "/account/password",
      title: "Password",
    },
    {
      href: "/account/social",
      title: "Social Links",
    },
  ];

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default function AccountLayout({ children }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/account/profile");
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
            Your account is not active. Please check your inbox for a verification email to activate your account before managing your settings.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-12 md:py-24">
      <div className="space-y-6">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile information.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </main>
  );
}