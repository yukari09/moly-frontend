import { getServerSideSitemapIndex } from 'next-sitemap/dist/index.server.js';

export async function GET(request) {
  const siteUrl = process.env.SITE_URL || 'https://example.com';
  
  // Generate sitemaps for each locale
  const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
  
  const sitemaps = locales.map(locale => ({
    loc: `${siteUrl}/sitemap-${locale}.xml`,
    lastmod: new Date().toISOString(),
  }));

  // Add main sitemap
  sitemaps.unshift({
    loc: `${siteUrl}/sitemap.xml`,
    lastmod: new Date().toISOString(),
  });

  return getServerSideSitemapIndex(sitemaps);
}