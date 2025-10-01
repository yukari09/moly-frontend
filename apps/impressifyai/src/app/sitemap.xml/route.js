import { NextResponse } from 'next/server';

const siteUrl = () => {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';   
}
// This is the Sitemap Index file.
// It points to all other sitemap files.
export async function GET() {
    const sitemaps = [
        'static.xml',
        'posts.xml',
        'categories.xml',
        // 'tags.xml'
    ];

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps.map(id => `
    <sitemap>
        <loc>${siteUrl()}/sitemaps/${id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`).join('')}
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
