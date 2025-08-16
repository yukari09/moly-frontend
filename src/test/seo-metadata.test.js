import { describe, it, expect } from 'vitest';
import { generateSEOMetadata, generateStructuredData, getBaseUrl } from '@/lib/seo';

describe('SEO Metadata Generation', () => {
  const testLocales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
  const testGenerators = ['writing', 'art', 'ai', 'chatgpt', 'midjourney', 'drawing', 'ai-video'];

  describe('generateSEOMetadata', () => {
    testGenerators.forEach(generator => {
      testLocales.forEach(locale => {
        it(`should generate valid metadata for ${generator} generator in ${locale}`, () => {
          const metadata = generateSEOMetadata(generator, locale, 'https://test.com');
          
          expect(metadata).toBeDefined();
          expect(metadata.title).toBeTruthy();
          expect(metadata.description).toBeTruthy();
          expect(metadata.keywords).toBeTruthy();
          expect(metadata.alternates).toBeDefined();
          expect(metadata.alternates.canonical).toBeTruthy();
          expect(metadata.openGraph).toBeDefined();
          expect(metadata.twitter).toBeDefined();
          expect(metadata.robots).toBeDefined();
        });
      });
    });

    it('should fallback to English when locale not found', () => {
      const metadata = generateSEOMetadata('writing', 'invalid-locale', 'https://test.com');
      expect(metadata.title).toContain('Writing Prompt Generator');
    });

    it('should throw error for invalid generator type', () => {
      expect(() => {
        generateSEOMetadata('invalid-generator', 'en', 'https://test.com');
      }).toThrow();
    });
  });

  describe('generateStructuredData', () => {
    testGenerators.forEach(generator => {
      testLocales.forEach(locale => {
        it(`should generate valid structured data for ${generator} generator in ${locale}`, () => {
          const structuredData = generateStructuredData(generator, locale, 'https://test.com');
          
          expect(structuredData).toBeDefined();
          expect(structuredData['@context']).toBe('https://schema.org');
          expect(structuredData['@type']).toBe('WebApplication');
          expect(structuredData.name).toBeTruthy();
          expect(structuredData.description).toBeTruthy();
          expect(structuredData.url).toBeTruthy();
          expect(structuredData.inLanguage).toBe(locale);
          expect(structuredData.offers).toBeDefined();
          expect(structuredData.creator).toBeDefined();
        });
      });
    });
  });

  describe('getBaseUrl', () => {
    it('should return localhost for development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const baseUrl = getBaseUrl();
      expect(baseUrl).toBe('http://localhost:3000');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle VERCEL_URL environment variable', () => {
      const originalVercelUrl = process.env.VERCEL_URL;
      process.env.VERCEL_URL = 'test-app.vercel.app';
      
      const baseUrl = getBaseUrl();
      expect(baseUrl).toBe('https://test-app.vercel.app');
      
      process.env.VERCEL_URL = originalVercelUrl;
    });
  });

  describe('SEO Data Completeness', () => {
    it('should have complete SEO data for all generator types and locales', () => {
      testGenerators.forEach(generator => {
        testLocales.forEach(locale => {
          const metadata = generateSEOMetadata(generator, locale, 'https://test.com');
          
          // Check required fields
          expect(metadata.title).toBeTruthy();
          expect(metadata.description).toBeTruthy();
          expect(metadata.keywords).toBeTruthy();
          
          // Check Open Graph
          expect(metadata.openGraph.title).toBeTruthy();
          expect(metadata.openGraph.description).toBeTruthy();
          expect(metadata.openGraph.url).toBeTruthy();
          expect(metadata.openGraph.locale).toBe(locale);
          
          // Check Twitter Card
          expect(metadata.twitter.title).toBeTruthy();
          expect(metadata.twitter.description).toBeTruthy();
          expect(metadata.twitter.card).toBe('summary_large_image');
          
          // Check hreflang alternates
          expect(metadata.alternates.languages).toBeDefined();
          expect(Object.keys(metadata.alternates.languages).length).toBeGreaterThan(0);
        });
      });
    });

    it('should have proper canonical URLs', () => {
      const baseUrl = 'https://test.com';
      
      testGenerators.forEach(generator => {
        testLocales.forEach(locale => {
          const metadata = generateSEOMetadata(generator, locale, baseUrl);
          const expectedPath = generator === 'ai-video' ? 'ai-video-prompt-generator' : `${generator}-prompt-generator`;
          const expectedCanonical = `${baseUrl}/${locale}/${expectedPath}`;
          
          expect(metadata.alternates.canonical).toBe(expectedCanonical);
          expect(metadata.openGraph.url).toBe(expectedCanonical);
        });
      });
    });
  });
});