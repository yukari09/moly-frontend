import { NextResponse } from 'next/server';
import esClient from "@/lib/elasticsearch";

const siteUrl = () => {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';   
}

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

async function getTerms(taxonomyField) {
    if (!process.env.GRAPHQL_TENANT) return [];
    const indexName = `${process.env.GRAPHQL_TENANT}_post`;
    try {
        const response = await esClient.search({
            index: indexName,
            size: 0,
            aggs: {
                unique_terms: {
                    terms: { field: taxonomyField, size: 1000 }
                }
            }
        });
        return response.aggregations.unique_terms.buckets.map(bucket => bucket.key);
    } catch (e) {
        console.error(`Sitemap ${taxonomyField} fetch failed:`, e);
        return [];
    }
}

export async function GET() {
    const categories = await getTerms("category.slug.keyword");
    const categoryUrls = categories.map(slug => ({
        loc: `${siteUrl()}/articles/cat-${slug}`,
        lastmod: new Date().toISOString(),
    }));

    const xml = generateSitemapXml(categoryUrls);
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}

// Revalidate this sitemap at most once per day
export const revalidate = 86400;
