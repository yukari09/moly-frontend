import Link from 'next/link';
import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/components/forgot-password-form"


export async function generateMetadata({ params }) {
  const { locale } = await(params);
  const t = await getTranslations({ locale, namespace: "ForgotPasswordPage" });

  return {
    title: `${t("title")} - ${process.env.APP_NAME}`,
    description: t("description"),
  };
}

export default async function LoginPage() {
  return (
    <div
      className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div
            className="flex items-center justify-center rounded-md">
            <img 
              src="/logo.svg"
              alt={process.env.APP_NAME}
              className='size-6 fill-white'
              width="64"
              height="64"
            />
          </div>
          {process.env.APP_NAME}
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
