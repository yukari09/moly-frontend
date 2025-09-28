"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('SignOutPage');

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // This will sign the user out and then redirect them to the homepage.
      await signOut({ redirect: true, callbackUrl: "/" });
      toast.success(t("signOutSuccess"));
    } catch (error) {
      toast.error(t("signOutError"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-24 bg-white">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            {t("cancelButton")}
          </Button>
          <Button onClick={handleSignOut} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("signOutButton")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
