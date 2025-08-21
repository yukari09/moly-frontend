import { useTranslations } from "next-intl";
import { getTranslations } from 'next-intl/server';
import { PromptGenerator } from "@/components/PromptGenerator";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ExamplesSection } from "@/components/ExamplesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ApplicablePlatformsSection } from "@/components/ApplicablePlatformsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { generateHomepageStructuredData } from "@/lib/seo";


export async function generateMetadata({ params: _ }) {
  const t = await getTranslations("HomePage");

  return {
    title: t('pageTitle'),
    description: t('pageDescription')
  };
}

export default function Home(request) {
  const t = useTranslations("HomePage");
  const homepageStructuredData = generateHomepageStructuredData(t);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
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
