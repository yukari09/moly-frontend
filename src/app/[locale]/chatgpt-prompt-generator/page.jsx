import { getTranslations } from 'next-intl/server';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import { generateSEOMetadata, generateStructuredData, generateFAQStructuredData, getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  return generateSEOMetadata('chatgpt', locale, baseUrl);
}

export default async function ChatGPTPromptGenerator({ params }) {
  const { locale } = await params;
  const t = await getTranslations('ChatGPTGenerator');
  const structuredDataArray = generateStructuredData('chatgpt', locale, getBaseUrl());
  const faqStructuredData = generateFAQStructuredData('chatgpt', locale, getBaseUrl());

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
            generatorType="chatgpt"
            defaultMode="DETAIL"
          />
        </div>

        {/* ChatGPT-Specific Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('chatgptFeatures.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('chatgptFeatures.roleAssignment.title')}</h3>
              <p className="text-gray-600">{t('chatgptFeatures.roleAssignment.description')}</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('chatgptFeatures.contextBuilding.title')}</h3>
              <p className="text-gray-600">{t('chatgptFeatures.contextBuilding.description')}</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('chatgptFeatures.outputFormat.title')}</h3>
              <p className="text-gray-600">{t('chatgptFeatures.outputFormat.description')}</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('chatgptFeatures.conversationFlow.title')}</h3>
              <p className="text-gray-600">{t('chatgptFeatures.conversationFlow.description')}</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('chatgptFeatures.parameters.title')}</h3>
              <p className="text-gray-600">{t('chatgptFeatures.parameters.description')}</p>
            </div>
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{t('chatgptFeatures.chainOfThought.title')}</h3>
              <p className="text-gray-600">{t('chatgptFeatures.chainOfThought.description')}</p>
            </div>
          </div>
        </div>

        {/* Role Assignment Templates */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('roleTemplates.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('roleTemplates.expert.title')}</h3>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 mb-4">
                <code className="text-sm text-gray-800">{t('roleTemplates.expert.template')}</code>
              </div>
              <p className="text-gray-600">{t('roleTemplates.expert.description')}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('roleTemplates.assistant.title')}</h3>
              <div className="bg-white p-4 rounded border-l-4 border-green-500 mb-4">
                <code className="text-sm text-gray-800">{t('roleTemplates.assistant.template')}</code>
              </div>
              <p className="text-gray-600">{t('roleTemplates.assistant.description')}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('roleTemplates.teacher.title')}</h3>
              <div className="bg-white p-4 rounded border-l-4 border-purple-500 mb-4">
                <code className="text-sm text-gray-800">{t('roleTemplates.teacher.template')}</code>
              </div>
              <p className="text-gray-600">{t('roleTemplates.teacher.description')}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('roleTemplates.analyst.title')}</h3>
              <div className="bg-white p-4 rounded border-l-4 border-orange-500 mb-4">
                <code className="text-sm text-gray-800">{t('roleTemplates.analyst.template')}</code>
              </div>
              <p className="text-gray-600">{t('roleTemplates.analyst.description')}</p>
            </div>
          </div>
        </div>

        {/* Conversation Context Building Examples */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('contextExamples.title')}</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">{t('contextExamples.businessAnalysis.title')}</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold mb-2">{t('contextExamples.businessAnalysis.context')}</h4>
                <p className="text-gray-700 mb-4">{t('contextExamples.businessAnalysis.contextText')}</p>
                <h4 className="font-semibold mb-2">{t('contextExamples.businessAnalysis.prompt')}</h4>
                <code className="text-sm text-gray-800 bg-gray-100 p-3 rounded block">{t('contextExamples.businessAnalysis.promptText')}</code>
              </div>
              <p className="text-gray-600">{t('contextExamples.businessAnalysis.explanation')}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">{t('contextExamples.creativeWriting.title')}</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold mb-2">{t('contextExamples.creativeWriting.context')}</h4>
                <p className="text-gray-700 mb-4">{t('contextExamples.creativeWriting.contextText')}</p>
                <h4 className="font-semibold mb-2">{t('contextExamples.creativeWriting.prompt')}</h4>
                <code className="text-sm text-gray-800 bg-gray-100 p-3 rounded block">{t('contextExamples.creativeWriting.promptText')}</code>
              </div>
              <p className="text-gray-600">{t('contextExamples.creativeWriting.explanation')}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">{t('contextExamples.technicalSupport.title')}</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold mb-2">{t('contextExamples.technicalSupport.context')}</h4>
                <p className="text-gray-700 mb-4">{t('contextExamples.technicalSupport.contextText')}</p>
                <h4 className="font-semibold mb-2">{t('contextExamples.technicalSupport.prompt')}</h4>
                <code className="text-sm text-gray-800 bg-gray-100 p-3 rounded block">{t('contextExamples.technicalSupport.promptText')}</code>
              </div>
              <p className="text-gray-600">{t('contextExamples.technicalSupport.explanation')}</p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('bestPractices.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{t('bestPractices.do.title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{t('bestPractices.do.item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{t('bestPractices.do.item2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{t('bestPractices.do.item3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{t('bestPractices.do.item4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{t('bestPractices.do.item5')}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{t('bestPractices.dont.title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{t('bestPractices.dont.item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{t('bestPractices.dont.item2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{t('bestPractices.dont.item3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{t('bestPractices.dont.item4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{t('bestPractices.dont.item5')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}