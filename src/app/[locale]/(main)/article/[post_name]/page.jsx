import esClient from "@/lib/elasticsearch";
import { notFound } from "next/navigation";
import EditorJSRenderer from "@/components/editorjs-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Helper function to fetch a single post from Elasticsearch by its slug
async function getPostBySlug(slug) {
    if (!process.env.GRAPHQL_TENANT) {
        throw new Error("GRAPHQL_TENANT environment variable is not set.");
    }
    const indexName = `${process.env.GRAPHQL_TENANT}_post`;

    try {
        const response = await esClient.search({
            index: indexName,
            size: 1,
            query: {
                term: {
                    "post_name.keyword": slug
                }
            }
        });

        if (response.hits.hits.length === 0) {
            return null;
        }

        return response.hits.hits[0]._source;
    } catch (error) {
        console.error("Elasticsearch query failed:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
  const { post_name } = await params;
  const post = await getPostBySlug(post_name);
  if (!post) {
    return {
      title: "Post not found",
    };
  }
  return {
    title: post.post_title,
    description: post.post_excerpt,
  };
}

export default async function ArticlePage({ params }) {
  const { post_name } = await params;
  const post = await getPostBySlug(post_name);

  if (!post) {
    notFound();
  }

  let content = null;
  try {
    if (post.post_content) {
      content = JSON.parse(post.post_content);
    }
  } catch (error) {
    console.error("Failed to parse post content:", error);
    content = {
      blocks: [
        {
          id: "parse-error",
          type: "paragraph",
          data: { text: "Error displaying content. The post data seems to be corrupted." },
        },
      ],
    };
  }

  return (
    <main className="bg-background">
      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {post.category?.map((cat, index) => (
                <Badge key={index} variant="secondary">{cat.name}</Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {post.post_title}
          </h1>
          {post.post_excerpt && (
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              {post.post_excerpt}
            </p>
          )}
          <div className="mt-8 flex justify-center items-center space-x-4 text-muted-foreground">
            <Avatar className="h-10 w-10">
                <AvatarImage src={post.author?.avatar} />
                <AvatarFallback>{post.author?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div>
                <span>By {post.author?.name || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <time dateTime={post.inserted_at}>
                    {new Date(post.inserted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
            </div>
          </div>
        </div>

        {content ? (
          <EditorJSRenderer data={content} />
        ) : (
          <p className="text-center text-muted-foreground">This post has no content.</p>
        )}

        <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
                {post.post_tag?.map((tag, index) => (
                    <Badge key={index} variant="outline"># {tag.name}</Badge>
                ))}
            </div>
        </div>

      </article>
    </main>
  );
}