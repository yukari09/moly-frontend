/**
 * Comprehensive structured data validation test
 */

import { generateStructuredData, generateFAQStructuredData } from '../lib/seo.js';

console.log('🧪 Running comprehensive structured data validation...\n');

const generatorTypes = ['writing', 'art', 'ai', 'chatgpt', 'midjourney', 'drawing', 'ai-video'];
const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
const baseUrl = 'https://example.com';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function validateWebApplicationSchema(schema) {
  const requiredFields = ['@context', '@type', 'name', 'description', 'url', 'applicationCategory', 'operatingSystem'];
  const errors = [];
  
  for (const field of requiredFields) {
    if (!schema[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  if (schema['@type'] !== 'WebApplication') {
    errors.push(`Invalid @type: expected 'WebApplication', got '${schema['@type']}'`);
  }
  
  if (schema.offers && (!schema.offers.price || !schema.offers.priceCurrency)) {
    errors.push('Incomplete offers object');
  }
  
  if (schema.aggregateRating && (!schema.aggregateRating.ratingValue || !schema.aggregateRating.reviewCount)) {
    errors.push('Incomplete aggregateRating object');
  }
  
  return errors;
}

function validateBreadcrumbSchema(schema) {
  const errors = [];
  
  if (schema['@type'] !== 'BreadcrumbList') {
    errors.push(`Invalid @type: expected 'BreadcrumbList', got '${schema['@type']}'`);
  }
  
  if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
    errors.push('Missing or invalid itemListElement array');
  } else {
    schema.itemListElement.forEach((item, index) => {
      if (!item['@type'] || item['@type'] !== 'ListItem') {
        errors.push(`Item ${index}: Invalid @type`);
      }
      if (!item.position || !item.name || !item.item) {
        errors.push(`Item ${index}: Missing required fields`);
      }
    });
  }
  
  return errors;
}

function validateFAQSchema(schema) {
  const errors = [];
  
  if (schema['@type'] !== 'FAQPage') {
    errors.push(`Invalid @type: expected 'FAQPage', got '${schema['@type']}'`);
  }
  
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push('Missing or invalid mainEntity array');
  } else {
    schema.mainEntity.forEach((question, index) => {
      if (!question['@type'] || question['@type'] !== 'Question') {
        errors.push(`Question ${index}: Invalid @type`);
      }
      if (!question.name) {
        errors.push(`Question ${index}: Missing name`);
      }
      if (!question.acceptedAnswer || !question.acceptedAnswer.text) {
        errors.push(`Question ${index}: Missing or invalid acceptedAnswer`);
      }
    });
  }
  
  return errors;
}

function runTest(testName, testFunction) {
  totalTests++;
  try {
    const result = testFunction();
    if (result === true || (Array.isArray(result) && result.length === 0)) {
      console.log(`✅ ${testName}`);
      passedTests++;
      return true;
    } else {
      console.log(`❌ ${testName}`);
      if (Array.isArray(result) && result.length > 0) {
        result.forEach(error => console.log(`   - ${error}`));
      }
      failedTests++;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${testName} - Error: ${error.message}`);
    failedTests++;
    return false;
  }
}

// Test each generator type with each locale
for (const generatorType of generatorTypes) {
  console.log(`\n📋 Testing ${generatorType} generator:`);
  
  for (const locale of locales) {
    // Test structured data generation
    runTest(`${generatorType} - ${locale} - Data Generation`, () => {
      const data = generateStructuredData(generatorType, locale, baseUrl);
      return Array.isArray(data) && data.length === 2;
    });
    
    // Test WebApplication schema
    runTest(`${generatorType} - ${locale} - WebApplication Schema`, () => {
      const data = generateStructuredData(generatorType, locale, baseUrl);
      const webApp = data.find(item => item['@type'] === 'WebApplication');
      return webApp ? validateWebApplicationSchema(webApp) : ['WebApplication schema not found'];
    });
    
    // Test BreadcrumbList schema
    runTest(`${generatorType} - ${locale} - BreadcrumbList Schema`, () => {
      const data = generateStructuredData(generatorType, locale, baseUrl);
      const breadcrumb = data.find(item => item['@type'] === 'BreadcrumbList');
      return breadcrumb ? validateBreadcrumbSchema(breadcrumb) : ['BreadcrumbList schema not found'];
    });
    
    // Test FAQ schema (only for generators that have FAQ data)
    if (['writing', 'art', 'chatgpt', 'midjourney'].includes(generatorType)) {
      runTest(`${generatorType} - ${locale} - FAQ Schema`, () => {
        const faqData = generateFAQStructuredData(generatorType, locale, baseUrl);
        return faqData ? validateFAQSchema(faqData) : ['FAQ schema not generated'];
      });
    }
  }
}

// Test URL generation
console.log(`\n🔗 Testing URL generation:`);
runTest('Standard generator URL', () => {
  const data = generateStructuredData('writing', 'en', baseUrl);
  const webApp = data.find(item => item['@type'] === 'WebApplication');
  return webApp.url === 'https://example.com/en/writing-prompt-generator';
});

runTest('AI video generator URL', () => {
  const data = generateStructuredData('ai-video', 'en', baseUrl);
  const webApp = data.find(item => item['@type'] === 'WebApplication');
  return webApp.url === 'https://example.com/en/ai-video-prompt-generator';
});

// Test multilingual content
console.log(`\n🌍 Testing multilingual content:`);
runTest('English content exists', () => {
  const data = generateStructuredData('writing', 'en', baseUrl);
  const webApp = data.find(item => item['@type'] === 'WebApplication');
  return webApp.name.includes('Writing Prompt Generator');
});

runTest('Chinese content exists', () => {
  const data = generateStructuredData('writing', 'zh', baseUrl);
  const webApp = data.find(item => item['@type'] === 'WebApplication');
  return webApp.name.includes('写作提示词生成器');
});

runTest('Japanese content exists', () => {
  const data = generateStructuredData('writing', 'ja', baseUrl);
  const webApp = data.find(item => item['@type'] === 'WebApplication');
  return webApp.name.includes('ライティングプロンプトジェネレーター');
});

// Summary
console.log(`\n📊 Test Summary:`);
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log(`\n🎉 All structured data tests passed! The implementation is ready for production.`);
} else {
  console.log(`\n⚠️  Some tests failed. Please review the errors above.`);
}

console.log(`\n📝 Next steps:`);
console.log(`1. Test with Google Rich Results Tool: https://search.google.com/test/rich-results`);
console.log(`2. Validate with Schema.org validator: https://validator.schema.org/`);
console.log(`3. Monitor search console for structured data errors after deployment`);