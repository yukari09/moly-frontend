import { NextResponse } from 'next/server';
import esClient from "@/lib/elasticsearch";

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

async function getPosts() {
    if (!process.env.GRAPHQL_TENANT) return [];
    const indexName = `${process.env.GRAPHQL_TENANT}_post`;
    try {
        const response = await esClient.search({
            index: indexName,
            size: 10000,
            _source: ["post_name", "updated_at"],
            query: {
                bool: {
                    filter: [
                        { term: { post_status: "publish" } },
                        { term: { post_type: "post" } }
                    ]
                }
            }
        });
        return response.hits.hits.map(hit => hit._source);
    } catch (e) {
        console.error("Sitemap posts fetch failed:", e);
        return [];
    }
}

export async function GET() {
    const posts = await getPosts();
    const postUrls = posts.map(post => ({
        loc: `${SITE_URL}/article/${post.post_name}`,
        lastmod: new Date(post.updated_at).toISOString(),
    }));

    const xml = generateSitemapXml(postUrls);
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}

// Revalidate this sitemap at most once per hour
export const revalidate = 3600;
