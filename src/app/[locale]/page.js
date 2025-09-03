import HomeHeroSection from "@/components/home/HomeHeroSection";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, UtensilsCrossed, Globe, Palette } from 'lucide-react';

export const metadata = {
  title: "DayCal - Discover the World's Celebrations",
  description: "Your guide to the stories, traditions, and dates behind global festivals.",
};

const featuredFestivals = [
  { title: "Holi Festival", description: "A vibrant festival of colors, love, and spring.", tags: ["Cultural", "Religious"] },
  { title: "Oktoberfest", description: "The world's largest Volksfest, held annually in Munich.", tags: ["Food & Drink"] },
  { title: "Dia de los Muertos", description: "A multi-day holiday to remember friends and family.", tags: ["Cultural", "Family"] },
];

const interestCategories = [
  { name: "Music", icon: Music },
  { name: "Food & Drink", icon: UtensilsCrossed },
  { name: "Cultural", icon: Globe },
  { name: "Arts", icon: Palette },
];

const recentStories = [
  { title: "The History of Lantern Festivals", author: "Jane Doe" },
  { title: "10 Harvest Festivals to Visit in Autumn", author: "John Smith" },
  { title: "A Traveler's Guide to Carnival in Rio", author: "Maria Garcia" },
];

const countries = [
  { name: "Argentina", code: "ar" },
  { name: "Australia", code: "au" },
  { name: "Brazil", code: "br" },
  { name: "Canada", code: "ca" },
  { name: "China", code: "cn" },
  { name: "Egypt", code: "eg" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "Greece", code: "gr" },
  { name: "India", code: "in" },
  { name: "Ireland", code: "ie" },
  { name: "Italy", code: "it" },
  { name: "Japan", code: "jp" },
  { name: "Mexico", code: "mx" },
  { name: "Morocco", code: "ma" },
  { name: "Netherlands", code: "nl" },
  { name: "New Zealand", code: "nz" },
  { name: "Peru", code: "pe" },
  { name: "Portugal", code: "pt" },
  { name: "South Africa", code: "za" },
  { name: "South Korea", code: "kr" },
  { name: "Spain", code: "es" },
  { name: "Switzerland", code: "ch" },
  { name: "Thailand", code: "th" },
  { name: "Turkey", code: "tr" },
  { name: "United Kingdom", code: "gb" },
  { name: "United States", code: "us" },
  { name: "Vietnam", code: "vn" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeHeroSection />

      <div className="container mx-auto">
        {/* 2. Featured Festivals */}
        <section className="py-16 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Happening This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFestivals.map((festival) => (
              <Card key={festival.title} className="flex flex-col overflow-hidden">
                <div className="relative w-full h-48">
                  <Image src={`https://placehold.co/800x600/6366f1/white?text=${encodeURIComponent(festival.title)}`} alt={festival.title} layout="fill" objectFit="cover" unoptimized={true} />
                </div>
                <CardHeader>
                  <CardTitle>{festival.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm mb-4">{festival.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {festival.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Discover by Interest */}
        <section className="py-16 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Discover by Interest</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {interestCategories.map((category) => (
              <Card key={category.name} className="p-4 flex flex-col items-center justify-center text-center hover:bg-accent transition-colors cursor-pointer">
                <category.icon className="w-10 h-10 mb-2 text-primary" />
                <p className="font-semibold">{category.name}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. Explore by Country */}
        <section className="py-16 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Explore by Country</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {countries.map((country) => (
              <Link key={country.name} href={`/explore?country=${encodeURIComponent(country.name)}`} className="w-40">
                <Badge variant="outline" className="w-full justify-center text-base px-4 py-2 cursor-pointer hover:bg-accent transition-colors flex items-center gap-2">
                  <Image src={`https://flagcdn.com/w20/${country.code}.png`} alt={`${country.name} flag`} width={20} height={15} />
                  <span>{country.name}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. From Our Stories */}
        <section className="py-16 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight mb-8">From Our Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentStories.map((story) => (
              <Card key={story.title} className="flex flex-col overflow-hidden">
                 <div className="relative w-full h-48">
                  <Image src={`https://placehold.co/800x600/1e293b/white?text=${encodeURIComponent(story.title)}`} alt={story.title} layout="fill" objectFit="cover" unoptimized={true} />
                </div>
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">By {story.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. Newsletter Signup */}
        <section className="py-16 lg:py-20 bg-secondary rounded-lg">
          <div className="text-center px-8">
            <h2 className="text-3xl font-bold tracking-tight">Get a weekly dose of culture</h2>
            <p className="mt-4 text-muted-foreground">Sign up for our newsletter to get the latest stories and festival updates delivered to your inbox.</p>
            <div className="mt-8 max-w-sm mx-auto flex gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

