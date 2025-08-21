import { getTranslations } from "next-intl/server";
import LoginPageClient from "./LoginPageClient";  

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LoginPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LoginPage() {
  return <LoginPageClient />;
}
