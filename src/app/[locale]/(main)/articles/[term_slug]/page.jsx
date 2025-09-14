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
  PaginationEllipsis
} from "@/components/ui/pagination";
import Link from "next/link";

const POSTS_PER_PAGE = 9;

/**
 * Fetches posts from Elasticsearch based on a term slug and pagination.
 * @param {string} termSlugWithPrefix - The slug with a prefix, e.g., 'cat-google' or 'tag-bing'.
 * @param {number} limit - The number of posts to fetch.
 * @param {number} offset - The starting offset for fetching posts.
 * @returns {Promise<{posts: any[], total: number, termName: string}>}
 */
async function getPostsByTerm(termSlugWithPrefix, limit, offset) {
  if (!process.env.GRAPHQL_TENANT) {
    throw new Error("GRAPHQL_TENANT environment variable is not set.");
  }
  const indexName = `${process.env.GRAPHQL_TENANT}_post`;

  let taxonomyField = "";
  let slug = "";
  let termName = "";

  if (termSlugWithPrefix.startsWith('cat-')) {
    taxonomyField = "category.slug.keyword";
    slug = termSlugWithPrefix.substring(4);
    termName = `Category: ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
  } else if (termSlugWithPrefix.startsWith('tag-')) {
    taxonomyField = "post_tag.slug.keyword";
    slug = termSlugWithPrefix.substring(4);
    termName = `Tag: ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
  } else {
    // If no prefix, we can decide to show all or nothing.
    // Let's treat it as a 404 for now.
    return { posts: [], total: 0, termName: "" };
  }

  const esQuery = {
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
    sort: [
      { "inserted_at": { "order": "desc" } }
    ]
  };

  try {
    const response = await esClient.search(esQuery);
    const posts = response.hits.hits.map(hit => hit._source);
    const total = response.hits.total.value;
    return { posts, total, termName };
  } catch (error) {
    console.error("Elasticsearch query failed:", error);
    return { posts: [], total: 0, termName };
  }
}

/**
 * Renders the pagination links based on the current state.
 * @param {{totalPages: number, currentPage: number, basePath: string}}
 */
function ArticlePagination({ totalPages, currentPage, basePath }) {
  if (totalPages <= 1) return null;

  const renderPageLinks = () => {
    const links = [];
    // Previous Button
    if (currentPage > 1) {
      links.push(
        <PaginationItem key="prev">
          <PaginationPrevious href={`${basePath}?page=${currentPage - 1}`} />
        </PaginationItem>
      );
    }

    // Page Number Buttons
    for (let i = 1; i <= totalPages; i++) {
        // Basic pagination logic: show first, last, current, and adjacent pages
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            links.push(
                <PaginationItem key={i}>
                    <PaginationLink href={`${basePath}?page=${i}`} isActive={i === currentPage}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            // Add ellipsis
            links.push(<PaginationItem key={`ellipsis-${i}`}><PaginationEllipsis /></PaginationItem>);
        }
    }

    // Next Button
    if (currentPage < totalPages) {
      links.push(
        <PaginationItem key="next">
          <PaginationNext href={`${basePath}?page=${currentPage + 1}`} />
        </PaginationItem>
      );
    }
    return links;
  };

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {renderPageLinks()}
      </PaginationContent>
    </Pagination>
  );
}

export default async function ArticlesByTermPage({ params, searchParams }) {
  const { term_slug } = params;
  const currentPage = parseInt(searchParams.page || '1', 10);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const { posts, total, termName } = await getPostsByTerm(term_slug, POSTS_PER_PAGE, offset);

  if (!posts || posts.length === 0) {
      // You might want a more specific message if the term exists but has no posts.
      // For now, a simple 404 if no posts are found for the given term.
      notFound();
  }

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-1 flex-col">
        <section className="border-grid">
          <div className="container-wrapper">
            <div className="mx-auto flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
              <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                {termName || "Articles"}
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
