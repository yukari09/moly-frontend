/**
 * Test structured data generation
 */

import { generateStructuredData, generateFAQStructuredData } from '../lib/seo.js';

// Test WebApplication and BreadcrumbList structured data
console.log('Testing structured data generation...');

try {
  // Test writing generator structured data
  const writingStructuredData = generateStructuredData('writing', 'en', 'https://example.com');
  console.log('✅ Writing generator structured data generated successfully');
  console.log('Number of structured data objects:', writingStructuredData.length);
  
  // Verify WebApplication schema
  const webApp = writingStructuredData.find(data => data['@type'] === 'WebApplication');
  if (webApp) {
    console.log('✅ WebApplication schema found');
    console.log('- Name:', webApp.name);
    console.log('- Description:', webApp.description);
    console.log('- Features:', webApp.featureList.length, 'features');
  } else {
    console.log('❌ WebApplication schema not found');
  }
  
  // Verify BreadcrumbList schema
  const breadcrumb = writingStructuredData.find(data => data['@type'] === 'BreadcrumbList');
  if (breadcrumb) {
    console.log('✅ BreadcrumbList schema found');
    console.log('- Items:', breadcrumb.itemListElement.length, 'items');
  } else {
    console.log('❌ BreadcrumbList schema not found');
  }
  
  // Test FAQ structured data
  const faqData = generateFAQStructuredData('writing', 'en', 'https://example.com');
  if (faqData) {
    console.log('✅ FAQ structured data generated successfully');
    console.log('- Questions:', faqData.mainEntity.length, 'questions');
  } else {
    console.log('❌ FAQ structured data not generated');
  }
  
  // Test different generator types
  const generatorTypes = ['art', 'ai', 'chatgpt', 'midjourney', 'drawing', 'ai-video'];
  for (const type of generatorTypes) {
    try {
      const data = generateStructuredData(type, 'en', 'https://example.com');
      console.log(`✅ ${type} generator structured data: ${data.length} objects`);
    } catch (error) {
      console.log(`❌ ${type} generator structured data failed:`, error.message);
    }
  }
  
  // Test different locales
  const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
  for (const locale of locales) {
    try {
      const data = generateStructuredData('writing', locale, 'https://example.com');
      console.log(`✅ Writing generator ${locale} locale: ${data.length} objects`);
    } catch (error) {
      console.log(`❌ Writing generator ${locale} locale failed:`, error.message);
    }
  }
  
  console.log('\n🎉 All structured data tests completed!');
  
} catch (error) {
  console.error('❌ Structured data test failed:', error);
}