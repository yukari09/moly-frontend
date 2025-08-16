/**
 * Utility functions for sitemap management and search engine submission
 */

/**
 * Submit sitemap to Google Search Console
 * @param {string} sitemapUrl - Full URL to the sitemap
 * @returns {Promise<boolean>} - Success status
 */
export async function submitToGoogle(sitemapUrl) {
  try {
    // Google Search Console API endpoint for sitemap submission
    const endpoint = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'Next.js Sitemap Submitter'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error submitting sitemap to Google:', error);
    return false;
  }
}

/**
 * Submit sitemap to Bing Webmaster Tools
 * @param {string} sitemapUrl - Full URL to the sitemap
 * @returns {Promise<boolean>} - Success status
 */
export async function submitToBing(sitemapUrl) {
  try {
    // Bing Webmaster Tools API endpoint for sitemap submission
    const endpoint = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'Next.js Sitemap Submitter'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error submitting sitemap to Bing:', error);
    return false;
  }
}

/**
 * Submit sitemap to multiple search engines
 * @param {string} baseUrl - Base URL of the site
 * @returns {Promise<Object>} - Submission results
 */
export async function submitSitemaps(baseUrl) {
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  const indexSitemapUrl = `${baseUrl}/server-sitemap-index.xml`;
  
  const results = {
    google: {
      main: false,
      index: false
    },
    bing: {
      main: false,
      index: false
    }
  };

  try {
    // Submit main sitemap
    results.google.main = await submitToGoogle(sitemapUrl);
    results.bing.main = await submitToBing(sitemapUrl);

    // Submit sitemap index
    results.google.index = await submitToGoogle(indexSitemapUrl);
    results.bing.index = await submitToBing(indexSitemapUrl);

    // Submit individual locale sitemaps
    const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
    
    for (const locale of locales) {
      const localeSitemapUrl = `${baseUrl}/sitemap-${locale}.xml`;
      await submitToGoogle(localeSitemapUrl);
      await submitToBing(localeSitemapUrl);
    }

  } catch (error) {
    console.error('Error in sitemap submission process:', error);
  }

  return results;
}

/**
 * Generate sitemap URLs for all locales
 * @param {string} baseUrl - Base URL of the site
 * @returns {Array<string>} - Array of sitemap URLs
 */
export function generateSitemapUrls(baseUrl) {
  const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
  
  const urls = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/server-sitemap-index.xml`
  ];

  // Add locale-specific sitemaps
  locales.forEach(locale => {
    urls.push(`${baseUrl}/sitemap-${locale}.xml`);
  });

  return urls;
}

/**
 * Validate sitemap accessibility
 * @param {string} sitemapUrl - URL to validate
 * @returns {Promise<boolean>} - Whether sitemap is accessible
 */
export async function validateSitemap(sitemapUrl) {
  try {
    const response = await fetch(sitemapUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Next.js Sitemap Validator'
      }
    });

    return response.ok && response.headers.get('content-type')?.includes('xml');
  } catch (error) {
    console.error(`Error validating sitemap ${sitemapUrl}:`, error);
    return false;
  }
}

/**
 * Get sitemap last modified date
 * @param {string} sitemapUrl - URL to check
 * @returns {Promise<Date|null>} - Last modified date or null
 */
export async function getSitemapLastModified(sitemapUrl) {
  try {
    const response = await fetch(sitemapUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Next.js Sitemap Checker'
      }
    });

    const lastModified = response.headers.get('last-modified');
    return lastModified ? new Date(lastModified) : null;
  } catch (error) {
    console.error(`Error getting sitemap last modified date ${sitemapUrl}:`, error);
    return null;
  }
}