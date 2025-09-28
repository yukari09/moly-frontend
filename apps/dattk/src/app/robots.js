const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
