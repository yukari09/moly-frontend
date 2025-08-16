import { getBaseUrl } from '@/lib/seo';

export default function sitemap() {
  const baseUrl = getBaseUrl();
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

  // Add root redirect with high priority
  routes.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  });

  // Add home pages for each locale with highest priority
  locales.forEach(locale => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    });
  });

  // Add generator pages for each locale with high priority
  locales.forEach(locale => {
    generators.forEach(generator => {
      routes.push({
        url: `${baseUrl}/${locale}/${generator}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  // Add authentication and account pages with lower priority
  const authPages = ['login', 'register', 'forgot-password'];
  const accountPages = ['account/profile', 'account/password', 'account/social'];
  
  locales.forEach(locale => {
    [...authPages, ...accountPages].forEach(page => {
      routes.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    });
  });

  return routes;
}