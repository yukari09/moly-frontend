import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('drawing', locale, baseUrl);
}

export default async function DrawingPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('DrawingGenerator');
  const structuredDataArray = generateStructuredData('drawing', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('drawing', locale, getBaseUrl());

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
            generatorType="drawing"
            defaultMode="DETAIL"
          />
        </div>

        {/* 功能介绍区域 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.difficulty.title')}</h3>
            <p className="text-gray-600">{t('features.difficulty.description')}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.techniques.title')}</h3>
            <p className="text-gray-600">{t('features.techniques.description')}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">{t('features.inspiration.title')}</h3>
            <p className="text-gray-600">{t('features.inspiration.description')}</p>
          </div>
        </div>

        {/* 绘画技法指导区域 */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">{t('techniques.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">{t('techniques.pencil.title')}</h4>
              <p className="text-sm text-gray-600">{t('techniques.pencil.description')}</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">{t('techniques.charcoal.title')}</h4>
              <p className="text-sm text-gray-600">{t('techniques.charcoal.description')}</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">{t('techniques.ink.title')}</h4>
              <p className="text-sm text-gray-600">{t('techniques.ink.description')}</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">{t('techniques.digital.title')}</h4>
              <p className="text-sm text-gray-600">{t('techniques.digital.description')}</p>
            </div>
          </div>
        </div>

        {/* 难度级别指导区域 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">{t('difficulty.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">{t('difficulty.beginner.title')}</h3>
              <p className="text-green-700 mb-4">{t('difficulty.beginner.description')}</p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• {t('difficulty.beginner.skill1')}</li>
                <li>• {t('difficulty.beginner.skill2')}</li>
                <li>• {t('difficulty.beginner.skill3')}</li>
              </ul>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">{t('difficulty.intermediate.title')}</h3>
              <p className="text-yellow-700 mb-4">{t('difficulty.intermediate.description')}</p>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• {t('difficulty.intermediate.skill1')}</li>
                <li>• {t('difficulty.intermediate.skill2')}</li>
                <li>• {t('difficulty.intermediate.skill3')}</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">{t('difficulty.advanced.title')}</h3>
              <p className="text-red-700 mb-4">{t('difficulty.advanced.description')}</p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• {t('difficulty.advanced.skill1')}</li>
                <li>• {t('difficulty.advanced.skill2')}</li>
                <li>• {t('difficulty.advanced.skill3')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 创意灵感区域 */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">{t('inspiration.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('inspiration.subjects.title')}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.subjects.nature')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.subjects.portraits')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.subjects.architecture')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.subjects.fantasy')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.subjects.animals')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.subjects.abstract')}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('inspiration.moods.title')}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.moods.peaceful')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.moods.dramatic')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.moods.mysterious')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.moods.joyful')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.moods.melancholic')}</span>
                <span className="bg-white px-3 py-1 rounded">{t('inspiration.moods.energetic')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}