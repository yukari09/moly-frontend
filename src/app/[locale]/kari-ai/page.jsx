import { getTranslations } from 'next-intl/server';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('kari-ai', locale, baseUrl);
}

export default async function KariAIPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations('KariAI');
  const structuredDataArray = generateStructuredData('kari-ai', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('kari-ai', locale, getBaseUrl());

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
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
              {t('hero.description')}
            </p>
            <Link 
              href="/ai-prompt-generator"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              {t('hero.cta')}
            </Link>
          </div>
        </section>

        {/* 4-D Methodology Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('methodology.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                {t('methodology.subtitle')}
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('methodology.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('methodology.deconstruct.title')}</h3>
                <p className="text-blue-600 font-medium mb-3">{t('methodology.deconstruct.description')}</p>
                <p className="text-gray-600 text-sm">{t('methodology.deconstruct.details')}</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('methodology.diagnose.title')}</h3>
                <p className="text-green-600 font-medium mb-3">{t('methodology.diagnose.description')}</p>
                <p className="text-gray-600 text-sm">{t('methodology.diagnose.details')}</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('methodology.develop.title')}</h3>
                <p className="text-purple-600 font-medium mb-3">{t('methodology.develop.description')}</p>
                <p className="text-gray-600 text-sm">{t('methodology.develop.details')}</p>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('methodology.deliver.title')}</h3>
                <p className="text-orange-600 font-medium mb-3">{t('methodology.deliver.description')}</p>
                <p className="text-gray-600 text-sm">{t('methodology.deliver.details')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Techniques Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('techniques.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('techniques.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{t('techniques.roleAssignment.title')}</h3>
                <p className="text-gray-600">{t('techniques.roleAssignment.description')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{t('techniques.contextLayering.title')}</h3>
                <p className="text-gray-600">{t('techniques.contextLayering.description')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{t('techniques.outputSpecs.title')}</h3>
                <p className="text-gray-600">{t('techniques.outputSpecs.description')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{t('techniques.chainOfThought.title')}</h3>
                <p className="text-gray-600">{t('techniques.chainOfThought.description')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{t('techniques.fewShot.title')}</h3>
                <p className="text-gray-600">{t('techniques.fewShot.description')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{t('techniques.multiPerspective.title')}</h3>
                <p className="text-gray-600">{t('techniques.multiPerspective.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Support Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('platforms.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('platforms.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{t('platforms.chatgpt.title')}</h3>
                <p className="text-gray-600">{t('platforms.chatgpt.description')}</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{t('platforms.claude.title')}</h3>
                <p className="text-gray-600">{t('platforms.claude.description')}</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{t('platforms.gemini.title')}</h3>
                <p className="text-gray-600">{t('platforms.gemini.description')}</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{t('platforms.midjourney.title')}</h3>
                <p className="text-gray-600">{t('platforms.midjourney.description')}</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-xl md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-semibold mb-3">{t('platforms.other.title')}</h3>
                <p className="text-gray-600">{t('platforms.other.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('comparison.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('comparison.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">{t('comparison.kari.title')}</h3>
                <ul className="space-y-3">
                  {t.raw('comparison.kari.features').map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">{t('comparison.others.title')}</h3>
                <ul className="space-y-3">
                  {t.raw('comparison.others.features').map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('examples.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('examples.subtitle')}
              </p>
            </div>

            <div className="space-y-12">
              {/* Example 1 */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-6">{t('examples.example1.title')}</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-red-600 mb-3">{t('examples.before')}</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-gray-700 italic">"{t('examples.example1.before')}"</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-green-600 mb-3">{t('examples.after')}</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-700 text-sm">"{t('examples.example1.after')}"</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-3">{t('examples.improvements')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {t.raw('examples.example1.improvements').map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-6">{t('examples.example2.title')}</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-red-600 mb-3">{t('examples.before')}</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-gray-700 italic">"{t('examples.example2.before')}"</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-green-600 mb-3">{t('examples.after')}</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-700 text-sm">"{t('examples.example2.after')}"</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-3">{t('examples.improvements')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {t.raw('examples.example2.improvements').map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('caseStudies.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('caseStudies.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{t('caseStudies.study1.title')}</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{t('caseStudies.study1.challenge')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Solution:</h4>
                    <p className="text-gray-600 text-sm">{t('caseStudies.study1.solution')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600">Result:</h4>
                    <p className="text-gray-600 text-sm font-medium">{t('caseStudies.study1.result')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{t('caseStudies.study2.title')}</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{t('caseStudies.study2.challenge')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Solution:</h4>
                    <p className="text-gray-600 text-sm">{t('caseStudies.study2.solution')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600">Result:</h4>
                    <p className="text-gray-600 text-sm font-medium">{t('caseStudies.study2.result')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{t('caseStudies.study3.title')}</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{t('caseStudies.study3.challenge')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Solution:</h4>
                    <p className="text-gray-600 text-sm">{t('caseStudies.study3.solution')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600">Result:</h4>
                    <p className="text-gray-600 text-sm font-medium">{t('caseStudies.study3.result')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('faq.title')}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t('faq.q1.question')}</h3>
                <p className="text-gray-600">{t('faq.q1.answer')}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t('faq.q2.question')}</h3>
                <p className="text-gray-600">{t('faq.q2.answer')}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t('faq.q3.question')}</h3>
                <p className="text-gray-600">{t('faq.q3.answer')}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t('faq.q4.question')}</h3>
                <p className="text-gray-600">{t('faq.q4.answer')}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t('faq.q5.question')}</h3>
                <p className="text-gray-600">{t('faq.q5.answer')}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t('faq.q6.question')}</h3>
                <p className="text-gray-600">{t('faq.q6.answer')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-blue-600">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-4">
              {t('cta.subtitle')}
            </p>
            <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('cta.description')}
            </p>
            
            <Link 
              href="/ai-prompt-generator"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg mb-8"
            >
              {t('cta.button')}
            </Link>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {t.raw('cta.features').map((feature, index) => (
                <div key={index} className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}