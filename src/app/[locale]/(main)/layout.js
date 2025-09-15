import { Geist } from "next/font/google";
import "./global.css";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout-header";
import Footer from "@/components/layout-footer";
import { listTermsOffset } from "@/lib/graphql";
import { SharedDataProvider } from "@/components/shared-data-provider";
import { generateRootMetadata } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

// Generate root metadata by calling the helper function from seo.js
export async function generateMetadata({ params }) {
  const {locale} = await params;
  return generateRootMetadata({ locale: locale });
}

async function getCategories() {
    try {
        const requestCategories = await listTermsOffset("category", 1000, 0, {"termMeta": {"termKey": {"eq": "show_in_menu"},"termValue": {"eq": "1"}}}, null, null, null, null, { revalidate: 3600 });
        return requestCategories.results || [];
    } catch (error) {
        console.error("Failed to fetch categories for layout:", error);
        return [];
    }
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  // Fetch categories for the layout
  const categories = await getCategories();

  return (
    <html lang={locale} className={geist.className}>
      <body>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SharedDataProvider categories={categories}>
              <Header categories={categories} />
              {children}
              <Toaster />
              <Footer />
            </SharedDataProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}