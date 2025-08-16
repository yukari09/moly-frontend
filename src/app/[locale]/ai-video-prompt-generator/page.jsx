import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('ai-video', locale, baseUrl);
}

export default async function AIVideoPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('AIVideoGenerator');
  const structuredDataArray = generateStructuredData('ai-video', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('ai-video', locale, getBaseUrl());

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
            generatorType="ai-video"
            defaultMode="DETAIL"
          />
        </div>

        {/* Video Platform Support */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('platformSupport.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.runway.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.runway.description')}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.pika.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.pika.description')}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.stable.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.stable.description')}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('platformSupport.other.title')}</h3>
              <p className="text-gray-600">{t('platformSupport.other.description')}</p>
            </div>
          </div>
        </div>

        {/* Scene Description Building Tools */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">{t('sceneBuilder.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('sceneBuilder.composition.title')}</h3>
              <p className="text-gray-600 mb-4">{t('sceneBuilder.composition.description')}</p>
              <div className="space-y-2">
                <span className="inline-block bg-white px-3 py-1 rounded text-sm">{t('sceneBuilder.composition.closeup')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm ml-2">{t('sceneBuilder.composition.wide')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm">{t('sceneBuilder.composition.aerial')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm ml-2">{t('sceneBuilder.composition.tracking')}</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('sceneBuilder.lighting.title')}</h3>
              <p className="text-gray-600 mb-4">{t('sceneBuilder.lighting.description')}</p>
              <div className="space-y-2">
                <span className="inline-block bg-white px-3 py-1 rounded text-sm">{t('sceneBuilder.lighting.golden')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm ml-2">{t('sceneBuilder.lighting.dramatic')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm">{t('sceneBuilder.lighting.soft')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm ml-2">{t('sceneBuilder.lighting.neon')}</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('sceneBuilder.movement.title')}</h3>
              <p className="text-gray-600 mb-4">{t('sceneBuilder.movement.description')}</p>
              <div className="space-y-2">
                <span className="inline-block bg-white px-3 py-1 rounded text-sm">{t('sceneBuilder.movement.smooth')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm ml-2">{t('sceneBuilder.movement.dynamic')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm">{t('sceneBuilder.movement.static')}</span>
                <span className="inline-block bg-white px-3 py-1 rounded text-sm ml-2">{t('sceneBuilder.movement.zoom')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video-Specific Optimization Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('videoFeatures.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('videoFeatures.duration.title')}</h3>
              <p className="text-gray-600">{t('videoFeatures.duration.description')}</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('videoFeatures.style.title')}</h3>
              <p className="text-gray-600">{t('videoFeatures.style.description')}</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('videoFeatures.narrative.title')}</h3>
              <p className="text-gray-600">{t('videoFeatures.narrative.description')}</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('videoFeatures.technical.title')}</h3>
              <p className="text-gray-600">{t('videoFeatures.technical.description')}</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('videoFeatures.mood.title')}</h3>
              <p className="text-gray-600">{t('videoFeatures.mood.description')}</p>
            </div>
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('videoFeatures.effects.title')}</h3>
              <p className="text-gray-600">{t('videoFeatures.effects.description')}</p>
            </div>
          </div>
        </div>

        {/* Platform-Specific Guidance */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">{t('platformGuidance.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t('platformGuidance.runway.title')}</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('platformGuidance.runway.tip1')}</li>
                <li>• {t('platformGuidance.runway.tip2')}</li>
                <li>• {t('platformGuidance.runway.tip3')}</li>
                <li>• {t('platformGuidance.runway.tip4')}</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t('platformGuidance.pika.title')}</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('platformGuidance.pika.tip1')}</li>
                <li>• {t('platformGuidance.pika.tip2')}</li>
                <li>• {t('platformGuidance.pika.tip3')}</li>
                <li>• {t('platformGuidance.pika.tip4')}</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t('platformGuidance.stable.title')}</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('platformGuidance.stable.tip1')}</li>
                <li>• {t('platformGuidance.stable.tip2')}</li>
                <li>• {t('platformGuidance.stable.tip3')}</li>
                <li>• {t('platformGuidance.stable.tip4')}</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t('platformGuidance.general.title')}</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('platformGuidance.general.tip1')}</li>
                <li>• {t('platformGuidance.general.tip2')}</li>
                <li>• {t('platformGuidance.general.tip3')}</li>
                <li>• {t('platformGuidance.general.tip4')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('bestPractices.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('bestPractices.clarity.title')}</h3>
              <p className="text-gray-600">{t('bestPractices.clarity.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('bestPractices.specificity.title')}</h3>
              <p className="text-gray-600">{t('bestPractices.specificity.description')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">{t('bestPractices.creativity.title')}</h3>
              <p className="text-gray-600">{t('bestPractices.creativity.description')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}