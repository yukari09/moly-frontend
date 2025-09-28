import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const generateSitemapXml = (urls) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
    </url>`).join('')}
</urlset>`;
};

export async function GET() {
    const staticUrls = [{
        loc: SITE_URL,
        lastmod: new Date().toISOString()
    }];
    const xml = generateSitemapXml(staticUrls);
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}

// Revalidate this sitemap at most once per day
export const revalidate = 86400;
