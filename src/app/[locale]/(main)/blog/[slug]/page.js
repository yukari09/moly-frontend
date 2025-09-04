import BlogPostContent from "@/components/blog-post-content";

// In a real app, you would fetch this data from a CMS or database.
const allPosts = [
  {
    slug: "the-future-of-web-development",
    title: "The Future of Web Development",
    description: "A look into the trends and technologies shaping the future of web development.",
    author: {
      name: "Jane Doe",
      bio: "Jane is a full-stack developer with a passion for building beautiful and performant web applications. She is a regular contributor to open-source projects and loves to write about technology.",
      avatar: "/placeholder.svg",
    },
    date: "September 3, 2024",
    tags: ["Web Development", "Future", "Technology"],
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        type: 'p',
        children: [
          { text: 'The world of web development is in a constant state of flux. New frameworks, libraries, and paradigms emerge at a dizzying pace, making it both an exciting and challenging field to be a part of. In this article, we\'ll explore some of the key trends and technologies that are shaping the future of the web.' },
        ],
      },
      {
        type: 'h2',
        children: [
          { text: 'The Rise of the Jamstack' },
        ],
      },
      {
        type: 'p',
        children: [
          { text: 'The Jamstack (JavaScript, APIs, and Markup) is not a specific technology, but rather a modern web development architecture. It promises faster performance, higher security, lower cost of scaling, and a better developer experience. By pre-rendering files and serving them directly from a CDN, Jamstack sites can be incredibly fast.' },
        ],
      },
      {
          type: 'p',
          children: [
              { text: 'Key players in this space include Next.js, Gatsby, and Nuxt.js. These frameworks make it easier than ever to build powerful, static sites that feel dynamic thanks to the power of APIs.' },
          ],
      },
      {
          type: 'blockquote',
          children: [
              { text: 'The future of the web is fast, secure, and dynamic. The Jamstack delivers on all three.' },
          ],
      },
      {
          type: 'h2',
          children: [
              { text: 'AI and Machine Learning Integration' },
          ],
      },
      {
          type: 'p',
          children: [
              { text: 'Artificial intelligence is no longer the realm of science fiction. It\'s increasingly being integrated into web applications to provide personalized experiences, intelligent search, and automated content generation. From chatbots to recommendation engines, AI is changing how users interact with the web.' },
          ],
      },
    ]
  }
];

async function getPostBySlug(slug) {
  return allPosts.find(p => p.slug === slug);
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://moly.app/blog/${post.slug}`,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.imageUrl],
    },
  };
}


export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="bg-white text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <BlogPostContent post={post} />
      </main>
    </div>
  );
}