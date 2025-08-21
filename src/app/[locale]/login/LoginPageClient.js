"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LoginForm from "@/components/LoginForm";

export default function LoginPageClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const t = useTranslations("LoginPage");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        turnstileToken,
      });

      if (result?.error) {
        toast.error(t("loginFailed"));
      } else {
        toast.success(t("loginSuccess"));
        router.push("/");
      }
    } catch (error) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <LoginForm
      register={register}
      onSubmit={handleSubmit(onSubmit)}
      errors={errors}
      isLoading={isLoading}
      turnstileToken={turnstileToken}
      setTurnstileToken={setTurnstileToken}
    />
  );
}
