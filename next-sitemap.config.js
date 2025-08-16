/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: [
    '/server-sitemap-index.xml', // <= exclude here
    '/debug/*',
    '/api/*',
    '/auth/*',
    '/verify-email',
    '/reset-password',
    '/forgot-password'
  ],
  alternateRefs: [
    {
      href: process.env.SITE_URL || 'https://example.com',
      hreflang: 'x-default',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/en`,
      hreflang: 'en',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/zh`,
      hreflang: 'zh',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/ja`,
      hreflang: 'ja',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/ko`,
      hreflang: 'ko',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/fr`,
      hreflang: 'fr',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/es`,
      hreflang: 'es',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/pt`,
      hreflang: 'pt',
    },
    {
      href: `${process.env.SITE_URL || 'https://example.com'}/de`,
      hreflang: 'de',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/debug/', '/auth/', '/_next/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://example.com'}/server-sitemap-index.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transformation for different page types
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

    // Default values
    let priority = 0.7;
    let changefreq = 'weekly';

    // Home pages get highest priority
    if (locales.some(locale => path === `/${locale}` || path === `/${locale}/`)) {
      priority = 1.0;
      changefreq = 'daily';
    }
    
    // Generator pages get high priority
    else if (locales.some(locale => 
      generators.some(gen => path === `/${locale}/${gen}` || path === `/${locale}/${gen}/`)
    )) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    
    // Root page
    else if (path === '/') {
      priority = 0.8;
      changefreq = 'daily';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => {
    // Add any additional dynamic paths here
    const result = [];
    
    // Add root redirect page
    result.push({
      loc: '/',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });

    return result;
  },
};