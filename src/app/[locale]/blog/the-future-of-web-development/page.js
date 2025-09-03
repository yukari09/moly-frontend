"use client";
import { EditorStatic } from "@/components/ui/editor-static";
import Header from "@/components/layout-header";
import Footer from "@/components/layout-footer";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


const post = {
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
};


export default function BlogPostPage({ params }) {
  // In a real app, you\'d fetch the post data based on the slug:
  // const post = await getPostBySlug(params.slug);

  return (
    <>
      <Header />
      <div className="bg-white text-gray-800">
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-3xl mx-auto">
            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage alt={post.author.name} src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{post.author.name}</p>
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative w-full aspect-[16/9] mb-8">
              <Image
                src={post.imageUrl}
                alt={post.title}
                className="rounded-lg object-cover"
                fill
                priority
              />
            </div>

            {/* Post Content */}
            <EditorStatic
              value={post.content}
              className="prose   max-w-none"
            />

            {/* Author Bio */}
            <section className="mt-16 p-6 rounded-lg bg-gray-50">
                <div className="flex items-center">
                    <Avatar className="h-16 w-16 mr-6">
                        <AvatarImage alt={post.author.name} src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="text-lg font-bold">About the author</h4>
                        <p className="font-semibold text-xl">{post.author.name}</p>
                        <p className="text-gray-600 mt-1">{post.author.bio}</p>
                    </div>
                </div>
            </section>

            {/* Comments Section (Placeholder) */}
            <section className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Comments</h3>
                <div className="space-y-6">
                    {/* Add Comment Form */}
                    <div className="grid w-full gap-2">
                        <Textarea placeholder="Type your comment here." />
                        <Button>Post Comment</Button>
                    </div>
                    {/* Existing Comments */}
                    <div className="pt-6 border-t">
                        <div className="flex items-start space-x-4">
                            <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">A User</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                                <p className="text-gray-700">This is a great article! Thanks for sharing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}
