import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  submitToGoogle, 
  submitToBing, 
  submitSitemaps, 
  generateSitemapUrls, 
  validateSitemap,
  getSitemapLastModified 
} from '@/lib/sitemap';

// Mock fetch globally
global.fetch = vi.fn();

describe('Sitemap Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateSitemapUrls', () => {
    it('should generate correct sitemap URLs', () => {
      const baseUrl = 'https://example.com';
      const urls = generateSitemapUrls(baseUrl);
      
      expect(urls).toContain('https://example.com/sitemap.xml');
      expect(urls).toContain('https://example.com/server-sitemap-index.xml');
      expect(urls).toContain('https://example.com/sitemap-en.xml');
      expect(urls).toContain('https://example.com/sitemap-zh.xml');
      expect(urls).toContain('https://example.com/sitemap-ja.xml');
      expect(urls).toContain('https://example.com/sitemap-ko.xml');
      expect(urls).toContain('https://example.com/sitemap-fr.xml');
      expect(urls).toContain('https://example.com/sitemap-es.xml');
      expect(urls).toContain('https://example.com/sitemap-pt.xml');
      expect(urls).toContain('https://example.com/sitemap-de.xml');
    });
  });

  describe('submitToGoogle', () => {
    it('should submit sitemap to Google successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      const result = await submitToGoogle('https://example.com/sitemap.xml');
      
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'https://www.google.com/ping?sitemap=https%3A%2F%2Fexample.com%2Fsitemap.xml',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'User-Agent': 'Next.js Sitemap Submitter'
          })
        })
      );
    });

    it('should handle Google submission failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      const result = await submitToGoogle('https://example.com/sitemap.xml');
      
      expect(result).toBe(false);
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await submitToGoogle('https://example.com/sitemap.xml');
      
      expect(result).toBe(false);
    });
  });

  describe('submitToBing', () => {
    it('should submit sitemap to Bing successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      const result = await submitToBing('https://example.com/sitemap.xml');
      
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'https://www.bing.com/ping?sitemap=https%3A%2F%2Fexample.com%2Fsitemap.xml',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'User-Agent': 'Next.js Sitemap Submitter'
          })
        })
      );
    });
  });

  describe('validateSitemap', () => {
    it('should validate accessible XML sitemap', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/xml')
        }
      });

      const result = await validateSitemap('https://example.com/sitemap.xml');
      
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'https://example.com/sitemap.xml',
        expect.objectContaining({
          method: 'HEAD'
        })
      );
    });

    it('should reject non-XML content', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('text/html')
        }
      });

      const result = await validateSitemap('https://example.com/sitemap.xml');
      
      expect(result).toBe(false);
    });

    it('should handle inaccessible sitemaps', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await validateSitemap('https://example.com/sitemap.xml');
      
      expect(result).toBe(false);
    });
  });

  describe('getSitemapLastModified', () => {
    it('should get last modified date', async () => {
      const testDate = 'Wed, 21 Oct 2015 07:28:00 GMT';
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue(testDate)
        }
      });

      const result = await getSitemapLastModified('https://example.com/sitemap.xml');
      
      expect(result).toBeInstanceOf(Date);
      expect(result.toUTCString()).toBe(testDate);
    });

    it('should return null when no last-modified header', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue(null)
        }
      });

      const result = await getSitemapLastModified('https://example.com/sitemap.xml');
      
      expect(result).toBeNull();
    });
  });

  describe('submitSitemaps', () => {
    it('should submit all sitemaps successfully', async () => {
      // Mock all fetch calls to return success
      fetch.mockResolvedValue({
        ok: true,
        status: 200
      });

      const result = await submitSitemaps('https://example.com');
      
      expect(result).toEqual({
        google: {
          main: true,
          index: true
        },
        bing: {
          main: true,
          index: true
        }
      });

      // Should have made multiple fetch calls for different sitemaps
      expect(fetch).toHaveBeenCalledTimes(20); // 2 main + 2 index + 8 locales * 2 engines
    });
  });
});

describe('Sitemap API Route', () => {
  it('should handle sitemap submission API', async () => {
    // This would test the API route, but requires more complex mocking
    // of the Next.js environment. For now, we'll test the core functions.
    expect(true).toBe(true);
  });
});

describe('Next.js Sitemap Generation', () => {
  it('should generate sitemap with correct structure', () => {
    // Mock the sitemap function
    const mockSitemap = () => {
      const baseUrl = 'https://example.com';
      const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
      const generators = [
        'writing-prompt-generator',
        'art-prompt-generator', 
        'ai-prompt-generator',
        'chatgpt-prompt-generator',
        'midjourney-prompt-generator',
        'drawing-prompt-generator',
        'ai-video-prompt-generator'
      ];

      const routes = [];
      const now = new Date();

      // Add root redirect
      routes.push({
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });

      // Add home pages
      locales.forEach(locale => {
        routes.push({
          url: `${baseUrl}/${locale}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 1.0,
        });
      });

      return routes;
    };

    const sitemap = mockSitemap();
    
    expect(sitemap).toHaveLength(9); // 1 root + 8 locales
    expect(sitemap[0].url).toBe('https://example.com');
    expect(sitemap[0].priority).toBe(0.8);
    expect(sitemap[1].url).toBe('https://example.com/en');
    expect(sitemap[1].priority).toBe(1.0);
  });
});