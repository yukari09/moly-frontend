"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslations } from "next-intl";

export default function LoginForm({ register, onSubmit, errors, isLoading, turnstileToken, setTurnstileToken }) {
  const t = useTranslations("LoginPage");

  return (
    <div className="flex items-center justify-center py-24 bg-white">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...register("email", { required: t("emailRequired") })}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("passwordLabel")}</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: t("passwordRequired") })}
                />
                 {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
               <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={setTurnstileToken}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !turnstileToken}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("loginButton")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
           <div className="text-center text-sm w-full">
            {t("noAccountPrompt")}{" "}
            <Link href="/register" className="underline">
              {t("signUpLink")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}