import { getServerSideSitemap } from 'next-sitemap/dist/index.server.js';

export async function GET(request, { params }) {
  const { locale } = params;
  const siteUrl = process.env.SITE_URL || 'https://example.com';
  
  // Validate locale
  const validLocales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
  if (!validLocales.includes(locale)) {
    return new Response('Not Found', { status: 404 });
  }

  const generators = [
    'writing-prompt-generator',
    'art-prompt-generator', 
    'ai-prompt-generator',
    'chatgpt-prompt-generator',
    'midjourney-prompt-generator',
    'drawing-prompt-generator',
    'ai-video-prompt-generator'
  ];

  const fields = [];

  // Add home page for this locale
  fields.push({
    loc: `${siteUrl}/${locale}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 1.0,
  });

  // Add generator pages for this locale
  generators.forEach(generator => {
    fields.push({
      loc: `${siteUrl}/${locale}/${generator}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
    });
  });

  // Add any additional locale-specific pages
  const additionalPages = [
    'login',
    'register',
    'account/profile',
    'account/password',
    'account/social'
  ];

  additionalPages.forEach(page => {
    fields.push({
      loc: `${siteUrl}/${locale}/${page}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5,
    });
  });

  return getServerSideSitemap(fields);
}