import { GalleryVerticalEnd } from "lucide-react"
import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/components/forgot-password-form"


export async function generateMetadata({ params }) {
  const { locale } = await(params);
  const t = await getTranslations({ locale, namespace: "ForgotPasswordPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage() {
  return (
    <div
      className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {process.env.APP_NAME}
        </a>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
