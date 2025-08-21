import { getTranslations } from "next-intl/server";
import RegisterPageClient from "./RegisterPageClient";  

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "RegisterPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LoginPage() {
  return <RegisterPageClient />;
}
