import { Lora, Montserrat } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: {
    default: "DayCal",
    template: "%s | DayCal",
  },
  description:
    "Your guide to the stories, traditions, and dates behind global festivals.",
  openGraph: {
    title: "DayCal",
    description: "Your guide to the stories, traditions, and dates behind global festivals.",
    url: "https://daycal.app", // Placeholder URL
    siteName: "DayCal",
    images: [
      {
        url: "https://daycal.app/og.png", // Placeholder image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DayCal",
    description: "Your guide to the stories, traditions, and dates behind global festivals.",
    images: ["https://daycal.app/og.png"], // Placeholder image
  },
};

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
  return (
    <html lang={locale} className={`${lora.variable} ${montserrat.variable}`}>
      <body>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AppHeader />
            <main>{children}</main>
            <Toaster />
            <AppFooter />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}