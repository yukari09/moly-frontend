import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('art', locale, baseUrl);
}

export default async function ArtPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('ArtGenerator');
  const structuredDataArray = generateStructuredData('art', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('art', locale, getBaseUrl());

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
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <KariOptimizer 
            generatorType="art"
            defaultMode="DETAIL"
          />
        </div>

        {/* 功能介绍区域 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.styles.title')}</h3>
            <p className="text-gray-600">{t('features.styles.description')}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.composition.title')}</h3>
            <p className="text-gray-600">{t('features.composition.description')}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.techniques.title')}</h3>
            <p className="text-gray-600">{t('features.techniques.description')}</p>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}