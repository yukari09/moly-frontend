import { PostItem } from "@/components/article-item";
import esClient from "@/lib/elasticsearch";
import { notFound } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StructuredData } from "@/components/structured-data";
import { generateTermPageMetadata, generateBreadcrumbJsonLd, getTermInfoBySlug } from "@/lib/seo";
import logger from "@/lib/logger";

const POSTS_PER_PAGE = 9;

// Generate metadata by calling the helper function
export async function generateMetadata({ params }) {
  return generateTermPageMetadata({ params });
}

async function getPostsByTerm(termSlugWithPrefix, limit, offset) {
  if (!process.env.GRAPHQL_TENANT) {
    logger.error("GRAPHQL_TENANT environment variable is not set.");
  }
  const indexName = `${process.env.GRAPHQL_TENANT}_post`;

  let taxonomyField = "";
  let slug = "";

  if (termSlugWithPrefix.startsWith('cat-')) {
    taxonomyField = "category.slug.keyword";
    slug = termSlugWithPrefix.substring(4);
  } else if (termSlugWithPrefix.startsWith('tag-')) {
    taxonomyField = "post_tag.slug.keyword";
    slug = termSlugWithPrefix.substring(4);
  } else {
    return { posts: [], total: 0 };
  }

  try {
    const response = await esClient.search({
      index: indexName,
      size: limit,
      from: offset,
      query: {
        bool: {
          filter: [
            { term: { post_status: "publish" } },
            { term: { post_type: "post" } },
            { term: { [taxonomyField]: slug } }
          ]
        }
      },
      sort: [{ "inserted_at": { "order": "desc" } }]
    });
    const posts = response.hits.hits.map(hit => hit._source);
    const total = response.hits.total.value;
    return { posts, total };
  } catch (error) {
    console.error("Elasticsearch query failed:", error);
    return { posts: [], total: 0 };
  }
}

function ArticlePagination({ totalPages, currentPage, basePath }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`${basePath}?page=${currentPage - 1}`} />
          </PaginationItem>
        )}
        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink href={`${basePath}?page=${page}`} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={`${basePath}?page=${currentPage + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default async function ArticlesByTermPage({ params, searchParams }) {
  const { term_slug, locale } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const [termInfo, { posts, total }] = await Promise.all([
    getTermInfoBySlug(term_slug),
    getPostsByTerm(term_slug, POSTS_PER_PAGE, offset)
  ]);

  if (!termInfo || total === 0) {
    notFound();
  }

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const breadcrumbData = generateBreadcrumbJsonLd({ locale, termInfo });

  return (
    <div className="min-h-screen bg-white">
      <StructuredData data={breadcrumbData} />
      <main className="flex flex-1 flex-col">
        <section className="border-grid">
          <div className="container-wrapper">
            <div className="mx-auto flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
              <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                {`${termInfo.name}`}
              </h1>
            </div>
          </div>
        </section>

        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostItem key={post.id} post={post} layout="vertical" />
            ))}
          </div>
        </section>

        <ArticlePagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            basePath={`/articles/${term_slug}`} 
        />

      </main>
    </div>
  );
}
