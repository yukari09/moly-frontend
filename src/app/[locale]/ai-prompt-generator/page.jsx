import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('ai', locale, baseUrl);
}

export default async function AIPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('AIGenerator');
  const structuredDataArray = generateStructuredData('ai', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('ai', locale, getBaseUrl());

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
            generatorType="ai"
            defaultMode="DETAIL"
          />
        </div>

        {/* Platform Support Information */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('platformSupport.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.chatgpt.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.chatgpt.description')}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.claude.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.claude.description')}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.gemini.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.gemini.description')}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.other.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.other.description')}</p>
            </div>
          </div>
        </div>

        {/* Advanced Optimization Techniques */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('techniques.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('techniques.roleAssignment.title')}</h3>
              <p className="text-gray-600">{t('techniques.roleAssignment.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('techniques.contextLayering.title')}</h3>
              <p className="text-gray-600">{t('techniques.contextLayering.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('techniques.outputSpecs.title')}</h3>
              <p className="text-gray-600">{t('techniques.outputSpecs.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('techniques.chainOfThought.title')}</h3>
              <p className="text-gray-600">{t('techniques.chainOfThought.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('techniques.fewShot.title')}</h3>
              <p className="text-gray-600">{t('techniques.fewShot.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('techniques.multiPerspective.title')}</h3>
              <p className="text-gray-600">{t('techniques.multiPerspective.description')}</p>
            </div>
          </div>
        </div>

        {/* Universal Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.universal.title')}</h3>
            <p className="text-gray-600">{t('features.universal.description')}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.optimization.title')}</h3>
            <p className="text-gray-600">{t('features.optimization.description')}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.advanced.title')}</h3>
            <p className="text-gray-600">{t('features.advanced.description')}</p>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}