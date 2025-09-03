"use client";

import { EditorStatic } from "@/components/ui/editor-static";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function BlogPostContent({ post }) {
  return (
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
  );
}
