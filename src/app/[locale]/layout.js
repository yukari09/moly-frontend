import "./globals.css";
import { Geist } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { generateRootStructuredData } from "@/lib/seo";
import GoogleAnalytics from '@/components/GoogleAnalytics';

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Next.js Starter Templates and Themes",
  description:
    "Discover Next.js templates, starters, and themes to jumpstart your application or website build.",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  const structuredData = generateRootStructuredData();
  return (
    <html lang={locale} className={geist.className}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
