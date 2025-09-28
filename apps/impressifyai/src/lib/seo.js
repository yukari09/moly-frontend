import { getTranslations } from "next-intl/server";
import esClient from "@/lib/elasticsearch";
import logger from "./logger";

// --- Structured Data Generators ---

/**
 * Generates JSON-LD for a breadcrumb list.
 * @param {{locale: string, termInfo: {name: string, taxonomy: string} | null}}
 */
export function generateBreadcrumbJsonLd({ locale, termInfo }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const itemListElement = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${siteUrl}/${locale}`
        }
    ];

    if (termInfo) {
        itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": `${termInfo.taxonomy}: ${termInfo.name}`
        });
    }

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
    };
}

// --- Helper Functions ---

export async function getTermInfoBySlug(termSlugWithPrefix) {
  if (!process.env.GRAPHQL_TENANT) {
    logger.error("GRAPHQL_TENANT environment variable is not set.");
  }
  const indexName = `${process.env.GRAPHQL_TENANT}_post`;

  let taxonomyField = "";
  let slug = "";
  let taxonomy = "";

  if (termSlugWithPrefix.startsWith('cat-')) {
    taxonomyField = "category";
    taxonomy = "Category";
    slug = termSlugWithPrefix.substring(4);
  } else if (termSlugWithPrefix.startsWith('tag-')) {
    taxonomyField = "post_tag";
    taxonomy = "Tag";
    slug = termSlugWithPrefix.substring(4);
  } else {
    return null; 
  }

  try {
    const response = await esClient.search({
      index: indexName,
      size: 1,
      _source: [taxonomyField],
      query: {
        term: { [`${taxonomyField}.slug.keyword`]: slug }
      }
    });

    if (response.hits.hits.length === 0) {
      return null;
    }

    const termData = response.hits.hits[0]._source[taxonomyField][0];
    return {
      name: termData.name,
      slug: termData.slug,
      taxonomy: taxonomy,
    };
  } catch (error) {
    console.error("Elasticsearch getTermInfoBySlug failed:", error);
    return null;
  }
}

// --- Metadata Generators ---

/**
 * Generates the root metadata for the site.
 * To be used in the root layout.
 */
export async function generateRootMetadata({ locale }) {
  const t = await getTranslations({ locale, namespace: 'WebSite' });
  const siteName = t('title');
  const description = t('description');
  const ogImageUrl = '/og-image.png';

  return {
    title: {
      default: siteName,
      template: `%s ${t('subfix')}`,
    },
    description: description,
    openGraph: {
      title: siteName,
      description: description,
      url: '/',
      siteName: siteName,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generates metadata for a term (category/tag) page.
 */
export async function generateTermPageMetadata({ params }) {
  const { locale, term_slug } = await params;
  const t = await getTranslations({ locale: locale, namespace: 'WebSite' });
  const termInfo = await getTermInfoBySlug(term_slug);

  if (!termInfo) {
    return {
      title: `Not Found ${t('subfix')}`,
      description: t('description'),
    };
  }

  const title = `${termInfo.taxonomy}: ${termInfo.name}`;
  const description = `Articles under the ${termInfo.taxonomy.toLowerCase()} '${termInfo.name}'.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} ${t('subfix')}`,
      description: description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} ${t('subfix')}`,
      description: description,
    },
  };
}