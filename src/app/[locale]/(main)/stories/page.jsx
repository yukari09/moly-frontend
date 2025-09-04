import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArticleCard from "@/components/stories/ArticleCard";

const mockPosts = [
  {
    slug: "history-of-lantern-festivals",
    title: "The History of Lantern Festivals",
    excerpt: "Explore the ancient origins and rich cultural significance of lantern festivals across Asia, from dazzling displays to intimate ceremonies.",
    author: "Jane Doe",
    imageUrl: "https://placehold.co/800x600/1e293b/white?text=Lanterns",
    category: "Cultural Deep Dives",
  },
  {
    slug: "harvest-festivals-in-autumn",
    title: "10 Harvest Festivals to Visit in Autumn",
    excerpt: "From pumpkin patches in the US to grape harvests in France, discover the best autumn festivals celebrating the bounty of the season.",
    author: "John Smith",
    imageUrl: "https://placehold.co/800x600/f97316/white?text=Harvest",
    category: "Travel Guides",
  },
  {
    slug: "guide-to-carnival-in-rio",
    title: "A Traveler's Guide to Carnival in Rio",
    excerpt: "Experience the world's biggest party with our insider tips on navigating the vibrant streets, parades, and blocos of Rio's Carnival.",
    author: "Maria Garcia",
    imageUrl: "https://placehold.co/800x600/be185d/white?text=Carnival",
    category: "Travel Guides",
  },
  {
    slug: "the-serene-beauty-of-japanese-tea-ceremonies",
    title: "The Serene Beauty of Japanese Tea Ceremonies",
    excerpt: "A look into the meticulous art and profound philosophy of Chanoyu, the Japanese Way of Tea.",
    author: "Kenji Tanaka",
    imageUrl: "https://placehold.co/800x600/166534/white?text=Tea+Ceremony",
    category: "Cultural Deep Dives",
  },
    {
    slug: "exploring-the-markets-of-marrakech",
    title: "Exploring the Vibrant Souks of Marrakech",
    excerpt: "Get lost in a labyrinth of spices, textiles, and crafts. A sensory journey through the heart of Morocco.",
    author: "Aisha Benali",
    imageUrl: "https://placehold.co/800x600/c2410c/white?text=Marrakech",
    category: "Travel Guides",
  },
  {
    slug: "norways-midsummer-night-celebrations",
    title: "Norway's Midsummer Night Celebrations",
    excerpt: "Discover Sankthansaften, where bonfires light up the fjords to celebrate the longest day of the year.",
    author: "Erik Larsen",
    imageUrl: "https://placehold.co/800x600/0369a1/white?text=Norway+Fjord",
    category: "Cultural Deep Dives",
  },
];

const featuredPost = mockPosts[0];
const otherPosts = mockPosts.slice(1);
const categories = ["All", "Cultural Deep Dives", "Travel Guides", "Interviews"];

export default function StoriesPage() {
  return (
    <div className="container mx-auto py-8">
      {/* 1. Featured Article Section */}
      <section className="mb-12">
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image 
            src={featuredPost.imageUrl} 
            alt={featuredPost.title} 
            layout="fill" 
            objectFit="cover" 
            unoptimized={true} 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-serif font-bold text-white mb-2 max-w-3xl">{featuredPost.title}</h1>
            <p className="text-white/90 max-w-3xl mb-4">{featuredPost.excerpt}</p>
            <Button asChild size="lg">
              <Link href={`/stories/${featuredPost.slug}`}>Read More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Filter and Articles Grid Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-serif">All Stories</h2>
          <div className="w-[200px]">
            <Select defaultValue="All">
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}