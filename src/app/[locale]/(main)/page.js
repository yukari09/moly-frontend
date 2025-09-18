import { getTranslations } from "next-intl/server";
import { PostItem } from "@/components/article-item";
import esClient from "@/lib/elasticsearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import logger from "@/lib/logger";

export async function generateMetadata({ params }) {
  const {locale} = await params;
  const t = await getTranslations('WebSite');
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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US', 
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: '/',
    },
  };
}

async function getPostsFromES(limit = 10, offset = 0) {
    if (!process.env.GRAPHQL_TENANT) {
        logger.error("GRAPHQL_TENANT environment variable is not set.");
    }
    const indexName = `${process.env.GRAPHQL_TENANT}_post`;

    let filters = [{ term: { post_status: "publish" } },{ term: { post_type: "post" } }]

    try {
        const response = await esClient.search({
            index: indexName,
            size: limit,
            from: offset,
            query: {
                bool: {
                    filter: filters
                }
            },
            sort: [
                { "inserted_at": { "order": "desc" } }
            ]
        });

        return response.hits.hits.map(hit => hit._source);
    } catch (error) {
        console.error("Elasticsearch query failed:", error);
        return [];
    }
}


async function getAggregatedPostsFromES(excludedIds) {
    if (!process.env.GRAPHQL_TENANT) {
        logger.error("GRAPHQL_TENANT environment variable is not set.");
    }
    const indexName = `${process.env.GRAPHQL_TENANT}_post`;

    let filters = [
        { term: { post_status: "publish" } },
        { term: { post_type: "post" } }
    ];

    try {
        const response = await esClient.search({
            index: indexName,
            size: 0,
            query: {
                bool: {
                    filter: filters,
                    must_not: {
                        ids: {
                            values: excludedIds
                        }
                    }
                }
            },
            aggs: {
                posts_by_category: { 
                    terms: {
                        field: "category.slug.keyword",
                        size: 15
                    },
                    aggs: {
                        latest_posts: {  
                            top_hits: {
                                size: 3, 
                                sort: [
                                    { "inserted_at": { "order": "desc" } }
                                ]
                            }
                        }
                    }
                }
            }
        });

        const buckets = response.aggregations.posts_by_category.buckets;

        const aggregatedData = buckets.map(bucket => {
            const categorySlug = bucket.key;
            const latestPosts = bucket.latest_posts.hits.hits.map(hit => hit._source);
            return {
                category_slug: categorySlug,
                post_count: bucket.doc_count,
                posts: latestPosts
            };
        });

        return aggregatedData;
    } catch (error) {
        console.error("Elasticsearch aggregation query failed:", error);
        return [];
    }
}

export default async function Home() {
    const posts = await getPostsFromES(4);

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const otherFeaturedPosts = posts.length > 1 ? posts.slice(1, 4) : [];
    const excludedIds = posts.map((p) => {return p.id})
    const postByCat = await getAggregatedPostsFromES(excludedIds)

    return (
      <div className="min-h-screen bg-white">
        <main className="flex flex-1 flex-col">
          <section className="border-grid">
            <div className="container-wrapper">
              <div className="mx-auto flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
                <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                  Discover the Beauty of World Cultures
                </h1>
                <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
                  Travel beyond borders, embrace diversity, and share unforgettable experiences.
                </p>
              </div>
            </div>
          </section>

          {posts.length > 0 && (
            <section className="max-w-screen-2xl xl:mx-auto px-4 sm:px-6 mt-8 xl:my-12">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4  xl:mt-8">
                {featuredPost && <PostItem key={featuredPost.id} post={featuredPost} />}
                {
                  otherFeaturedPosts && otherFeaturedPosts.length > 0 &&
                  <div className="flex flex-col gap-8">
                    {otherFeaturedPosts.map(post => (
                        <PostItem layout="horizontal"  key={post.id} post={post} />
                    ))}
                  </div>
                }
              </div>
            </section>
          )}

          {postByCat.map((item, i) => {
            const first = item.posts[0];
            return (
            <section className="max-w-screen-2xl xl:mx-auto px-4 sm:px-6 mt-8 xl:my-12" >
              <div className="flex items-center justify-between">
                <h2 className="text-primary leading-tighter text-2xl font-semibold tracking-tight lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter">{first.category[0].name}</h2>
                <Link href={`/articles/cat-${first.category[0].slug}`}><Button variant="secondary" size="sm">More</Button></Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 xl:mt-8">
                {item.posts.map(post => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
            </section>
            )
          })}
        </main>
      </div>
    );
}