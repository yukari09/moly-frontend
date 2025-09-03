"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Clock, Share2, BookmarkPlus } from "lucide-react";

export default function StoryDetailContent({ story }) {
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Sidebar (Key Info) */}
        <aside className="lg:col-span-1 lg:sticky top-24 self-start space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Story Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Author</h4>
                  <p className="text-muted-foreground">{story.keyInfo.author}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Published</h4>
                  <p className="text-muted-foreground">{story.keyInfo.publishedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Read Time</h4>
                  <p className="text-muted-foreground">{story.keyInfo.readTime}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">{story.keyInfo.category}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {story.keyInfo.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-serif text-lg">Share & Save</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share Story</Button>
                    <Button variant="outline"><BookmarkPlus className="w-4 h-4 mr-2" /> Save for Later</Button>
                </div>
            </CardContent>
          </Card>

        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="prose prose-lg max-w-none">
            {story.storyContent.map((block, index) => {
              if (block.type === 'h2') {
                return <h2 key={index}>{block.children[0].text}</h2>;
              }
              if (block.type === 'p') {
                return <p key={index}>{block.children[0].text}</p>;
              }
              return null;
            })}
          </div>

          {/* Newsletter Signup Section */}
          <section className="mt-16 pt-8 border-t">
            <div className="bg-muted/50 rounded-lg p-8">
              <h3 className="text-2xl font-serif font-bold mb-2 text-center">
                Enjoyed this story?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-center">
                Subscribe to our newsletter for more cultural insights and travel stories delivered to your inbox.
              </p>
              <div className="flex max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  className="rounded-r-none focus:z-10"
                />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}