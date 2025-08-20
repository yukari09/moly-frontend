import { useTranslations } from "next-intl";
import { PromptGenerator } from "@/components/PromptGenerator";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ExamplesSection } from "@/components/ExamplesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ApplicablePlatformsSection } from "@/components/ApplicablePlatformsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";

export const metadata = {
  title: '关于我们',
  description: '这是一个关于我们公司的页面，提供公司的历史、使命和团队信息。',
  keywords: ['关于', '公司', '团队', '使命'],
  openGraph: {
    title: '关于我们',
    description: '深入了解我们的故事',
    url: 'https://你的网站.com/about',
    siteName: '你的网站',
  },
};

export default function Home(request) {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-xl mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-black">
            {t.rich("title")}
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-12">
          <PromptGenerator />
        </div>
      </main>

      <FeaturesSection />
      <ExamplesSection />
      <HowItWorksSection />
      <ApplicablePlatformsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
