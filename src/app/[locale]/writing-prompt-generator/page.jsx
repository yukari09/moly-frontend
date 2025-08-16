import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('writing', locale, baseUrl);
}

export default async function WritingPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('WritingGenerator');
  const structuredDataArray = generateStructuredData('writing', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('writing', locale, getBaseUrl());

  return (
    <>
      {/* WebApplication and BreadcrumbList structured data */}
      {structuredDataArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* FAQ structured data */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <KariOptimizer 
            generatorType="writing"
            defaultMode="DETAIL"
          />
        </div>

        {/* 功能介绍区域 */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('features.types.title')}</h3>
            <p className="text-sm sm:text-base text-gray-600">{t('features.types.description')}</p>
          </div>
          <div className="text-center p-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('features.difficulty.title')}</h3>
            <p className="text-sm sm:text-base text-gray-600">{t('features.difficulty.description')}</p>
          </div>
          <div className="text-center p-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('features.themes.title')}</h3>
            <p className="text-sm sm:text-base text-gray-600">{t('features.themes.description')}</p>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}