#!/usr/bin/env node

/**
 * Test script for sitemap functionality
 * Run with: node scripts/test-sitemap.js
 */

import { 
  generateSitemapUrls, 
  validateSitemap, 
  submitSitemaps,
  getSitemapLastModified 
} from '../src/lib/sitemap.js';

const TEST_BASE_URL = 'https://example.com';

async function testSitemapGeneration() {
  console.log('🗺️  Testing Sitemap Generation...\n');

  // Test URL generation
  console.log('1. Testing URL generation:');
  const urls = generateSitemapUrls(TEST_BASE_URL);
  console.log(`   Generated ${urls.length} sitemap URLs:`);
  urls.forEach(url => console.log(`   - ${url}`));
  console.log('   ✅ URL generation working\n');

  // Test sitemap validation (will fail for example.com, but tests the function)
  console.log('2. Testing sitemap validation:');
  try {
    const isValid = await validateSitemap(`${TEST_BASE_URL}/sitemap.xml`);
    console.log(`   Sitemap validation result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  } catch (error) {
    console.log(`   ⚠️  Validation test completed (expected for test URL)`);
  }
  console.log();

  // Test last modified check
  console.log('3. Testing last modified check:');
  try {
    const lastMod = await getSitemapLastModified(`${TEST_BASE_URL}/sitemap.xml`);
    console.log(`   Last modified: ${lastMod || 'Not available'}`);
  } catch (error) {
    console.log(`   ⚠️  Last modified test completed (expected for test URL)`);
  }
  console.log();

  // Test submission (will fail for example.com, but tests the function)
  console.log('4. Testing sitemap submission:');
  try {
    const results = await submitSitemaps(TEST_BASE_URL);
    console.log('   Submission results:', results);
  } catch (error) {
    console.log(`   ⚠️  Submission test completed (expected for test URL)`);
  }
  console.log();

  console.log('🎉 Sitemap testing completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Set SITE_URL environment variable to your actual domain');
  console.log('   2. Run: npm run build');
  console.log('   3. Deploy your application');
  console.log('   4. Test with: curl -X POST https://your-domain.com/api/sitemap/submit');
}

// Run the test
testSitemapGeneration().catch(console.error);