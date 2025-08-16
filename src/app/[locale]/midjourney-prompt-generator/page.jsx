import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('midjourney', locale, baseUrl);
}

export default async function MidjourneyPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('MidjourneyGenerator');
  const structuredDataArray = generateStructuredData('midjourney', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('midjourney', locale, getBaseUrl());

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
            generatorType="midjourney"
            defaultMode="DETAIL"
          />
        </div>

        {/* Midjourney-Specific Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('midjourneyFeatures.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('midjourneyFeatures.parameters.title')}</h3>
              <p className="text-gray-600">{t('midjourneyFeatures.parameters.description')}</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('midjourneyFeatures.styles.title')}</h3>
              <p className="text-gray-600">{t('midjourneyFeatures.styles.description')}</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('midjourneyFeatures.composition.title')}</h3>
              <p className="text-gray-600">{t('midjourneyFeatures.composition.description')}</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('midjourneyFeatures.lighting.title')}</h3>
              <p className="text-gray-600">{t('midjourneyFeatures.lighting.description')}</p>
            </div>
            <div className="text-center p-6 bg-pink-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('midjourneyFeatures.quality.title')}</h3>
              <p className="text-gray-600">{t('midjourneyFeatures.quality.description')}</p>
            </div>
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('midjourneyFeatures.aspectRatio.title')}</h3>
              <p className="text-gray-600">{t('midjourneyFeatures.aspectRatio.description')}</p>
            </div>
          </div>
        </div>

        {/* Parameter Guide */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('parameterGuide.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('parameterGuide.aspectRatio.title')}</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <code className="text-sm font-mono">--ar 16:9</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.aspectRatio.landscape')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <code className="text-sm font-mono">--ar 9:16</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.aspectRatio.portrait')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <code className="text-sm font-mono">--ar 1:1</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.aspectRatio.square')}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4">{t('parameterGuide.aspectRatio.description')}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('parameterGuide.quality.title')}</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-green-500">
                  <code className="text-sm font-mono">--q 2</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.quality.high')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-green-500">
                  <code className="text-sm font-mono">--q 1</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.quality.standard')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-green-500">
                  <code className="text-sm font-mono">--q 0.5</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.quality.draft')}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4">{t('parameterGuide.quality.description')}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('parameterGuide.stylize.title')}</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <code className="text-sm font-mono">--s 1000</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.stylize.high')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <code className="text-sm font-mono">--s 100</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.stylize.default')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <code className="text-sm font-mono">--s 0</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.stylize.low')}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4">{t('parameterGuide.stylize.description')}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('parameterGuide.version.title')}</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                  <code className="text-sm font-mono">--v 6.1</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.version.latest')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                  <code className="text-sm font-mono">--v 6.0</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.version.stable')}</span>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                  <code className="text-sm font-mono">--v 5.2</code>
                  <span className="ml-2 text-gray-600">{t('parameterGuide.version.classic')}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4">{t('parameterGuide.version.description')}</p>
            </div>
          </div>
        </div>

        {/* Style and Composition Guide */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('styleGuide.title')}</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">{t('styleGuide.artistic.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('styleGuide.artistic.photorealistic.title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">{t('styleGuide.artistic.photorealistic.description')}</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">{t('styleGuide.artistic.photorealistic.example')}</code>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('styleGuide.artistic.painterly.title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">{t('styleGuide.artistic.painterly.description')}</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">{t('styleGuide.artistic.painterly.example')}</code>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('styleGuide.artistic.digital.title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">{t('styleGuide.artistic.digital.description')}</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">{t('styleGuide.artistic.digital.example')}</code>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">{t('styleGuide.composition.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">{t('styleGuide.composition.lighting.title')}</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>{t('styleGuide.composition.lighting.golden')}</strong> - {t('styleGuide.composition.lighting.goldenDesc')}</li>
                    <li><strong>{t('styleGuide.composition.lighting.dramatic')}</strong> - {t('styleGuide.composition.lighting.dramaticDesc')}</li>
                    <li><strong>{t('styleGuide.composition.lighting.soft')}</strong> - {t('styleGuide.composition.lighting.softDesc')}</li>
                    <li><strong>{t('styleGuide.composition.lighting.neon')}</strong> - {t('styleGuide.composition.lighting.neonDesc')}</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">{t('styleGuide.composition.camera.title')}</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>{t('styleGuide.composition.camera.closeup')}</strong> - {t('styleGuide.composition.camera.closeupDesc')}</li>
                    <li><strong>{t('styleGuide.composition.camera.wide')}</strong> - {t('styleGuide.composition.camera.wideDesc')}</li>
                    <li><strong>{t('styleGuide.composition.camera.aerial')}</strong> - {t('styleGuide.composition.camera.aerialDesc')}</li>
                    <li><strong>{t('styleGuide.composition.camera.macro')}</strong> - {t('styleGuide.composition.camera.macroDesc')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('bestPractices.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600">{t('bestPractices.do.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <strong>{t('bestPractices.do.item1.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.do.item1.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <strong>{t('bestPractices.do.item2.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.do.item2.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <strong>{t('bestPractices.do.item3.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.do.item3.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <strong>{t('bestPractices.do.item4.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.do.item4.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <strong>{t('bestPractices.do.item5.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.do.item5.description')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-red-600">{t('bestPractices.dont.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <div>
                    <strong>{t('bestPractices.dont.item1.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.dont.item1.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <div>
                    <strong>{t('bestPractices.dont.item2.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.dont.item2.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <div>
                    <strong>{t('bestPractices.dont.item3.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.dont.item3.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <div>
                    <strong>{t('bestPractices.dont.item4.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.dont.item4.description')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <div>
                    <strong>{t('bestPractices.dont.item5.title')}</strong>
                    <p className="text-gray-600 text-sm">{t('bestPractices.dont.item5.description')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('examples.title')}</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('examples.portrait.title')}</h3>
              <div className="bg-white p-4 rounded-lg mb-3">
                <code className="text-sm text-gray-800">{t('examples.portrait.prompt')}</code>
              </div>
              <p className="text-gray-600">{t('examples.portrait.explanation')}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('examples.landscape.title')}</h3>
              <div className="bg-white p-4 rounded-lg mb-3">
                <code className="text-sm text-gray-800">{t('examples.landscape.prompt')}</code>
              </div>
              <p className="text-gray-600">{t('examples.landscape.explanation')}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('examples.conceptArt.title')}</h3>
              <div className="bg-white p-4 rounded-lg mb-3">
                <code className="text-sm text-gray-800">{t('examples.conceptArt.prompt')}</code>
              </div>
              <p className="text-gray-600">{t('examples.conceptArt.explanation')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}