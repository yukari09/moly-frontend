import { PostItem } from "@/components/article-item";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import esClient from "@/lib/elasticsearch";
import { ArrowRightCircle } from "lucide-react"

export const metadata = {
  title: "Home | Moly's Blog",
  description: "Welcome to Moly's Blog. Here we share our thoughts on web development, design, and more.",
};

async function getPostsFromES(limit = 10, offset = 0) {
    if (!process.env.GRAPHQL_TENANT) {
        throw new Error("GRAPHQL_TENANT environment variable is not set.");
    }
    const indexName = `${process.env.GRAPHQL_TENANT}_post`;

    try {
        const response = await esClient.search({
            index: indexName,
            size: limit,
            from: offset,
            query: {
                bool: {
                    filter: [
                        { term: { post_status: "publish" } },
                        { term: { post_type: "post" } }
                    ]
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


export default async function Home() {
    const posts = await getPostsFromES(9);

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const otherFeaturedPosts = posts.length > 1 ? posts.slice(1, 3) : [];
    const latestPosts = posts.length > 3 ? posts.slice(3) : [];

    return (
      <div className="min-h-screen bg-white">
        <main className="flex flex-1 flex-col">
          <section className="border-grid">
            <div className="container-wrapper">
              <div className="mx-auto flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
                <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                  Day Festival And Calendar
                </h1>
                <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
                  Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever.
                </p>
              </div>
            </div>
          </section>

          {posts.length > 0 && (
            <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mt-12">
              <h2 className="text-primary leading-tighter text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter">Featured Posts</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
                {featuredPost && <PostItem post={featuredPost} />}
                <div className="flex flex-col gap-8">
                  {otherFeaturedPosts.map(post => (
                      <Link key={post.id} href={`/article/${post.post_name}`} className="block group">
                        <article className="flex gap-4">
                            <div className="overflow-hidden rounded-sm w-1/3">
                                <Image src={post.featured_image || '/14.jpg'} alt={post.post_title} width={320} height={180} className="aspect-[2/1] object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="space-y-2 w-2/3">
                                <div className="text-sm text-muted-foreground font-medium">
                                    <time dateTime={post.inserted_at}>
                                        {new Date(post.inserted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </time>
                                </div>
                                <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter group-hover:underline">
                                    {post.post_title}
                                </h3>
                                <p className="line-clamp-2 text-muted-foreground">
                                    {post.post_excerpt}
                                </p>
                                {post.category && post.category.length > 0 && (
                                    <Badge variant="secondary">{post.category[0].name}</Badge>
                                )}
                            </div>
                        </article>
                      </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {latestPosts.length > 0 && (
            <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mt-28 mb-8">
              <h2 className="text-primary leading-tighter text-2xl font-semibold tracking-tight lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter">Latest Posts</h2>
              <div className="grid grid-cols-3 gap-8 mt-8">
                {latestPosts.map(post => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    );
}
