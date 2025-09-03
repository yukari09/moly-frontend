import { Geist } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout-header";
import Footer from "@/components/layout-footer";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Moly's Blog",
    template: "%s | Moly's Blog",
  },
  description:
    "A blog about web development, design, and more.",
  openGraph: {
    title: "Moly's Blog",
    description: "A blog about web development, design, and more.",
    url: "https://moly.app",
    siteName: "Moly's Blog",
    images: [
      {
        url: "https://moly.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moly's Blog",
    description: "A blog about web development, design, and more.",
    images: ["https://moly.app/og.png"],
  },
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
  return (
    <html lang={locale} className={geist.className}>
      <body>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}