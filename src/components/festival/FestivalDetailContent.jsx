"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorStatic } from "@/components/ui/editor-static";
import { Calendar, MapPin, Tag, Share2, PlusSquare } from "lucide-react";

export default function FestivalDetailContent({ festival }) {
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Sidebar (Key Info) */}
        <aside className="lg:col-span-1 lg:sticky top-24 self-start">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Date</h4>
                  <p className="text-muted-foreground">{festival.keyInfo.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-muted-foreground">{festival.keyInfo.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Type</h4>
                  <p className="text-muted-foreground">{festival.keyInfo.type}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {festival.keyInfo.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <Tabs defaultValue="story">
            <TabsList className="mb-6">
              <TabsTrigger value="story">The Story</TabsTrigger>
              <TabsTrigger value="traditions">Traditions & What to Expect</TabsTrigger>
              <TabsTrigger value="guide">Traveler's Guide</TabsTrigger>
            </TabsList>
            <div className="prose prose-lg max-w-none">
              <TabsContent value="story">
                <EditorStatic value={festival.storyContent} />
              </TabsContent>
              <TabsContent value="traditions">
                <EditorStatic value={festival.traditionsContent} />
              </TabsContent>
              <TabsContent value="guide">
                <EditorStatic value={festival.travelerGuideContent} />
              </TabsContent>
            </div>
          </Tabs>

          {/* Gallery Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-serif font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {festival.gallery.map((imgSrc, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image src={imgSrc} alt={`Gallery image ${index + 1}`} layout="fill" objectFit="cover" unoptimized={true} />
                </div>
              ))}
            </div>
          </section>

          {/* Social Share Section */}
          <section className="mt-12 text-center">
              <h3 className="text-lg font-semibold mb-4">Enjoy this festival?</h3>
              <div className="flex justify-center gap-4">
                  <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                  <Button variant="outline"><PlusSquare className="w-4 h-4 mr-2" /> Add to My Calendar</Button>
              </div>
          </section>
        </main>
      </div>
    </div>
  );
}
