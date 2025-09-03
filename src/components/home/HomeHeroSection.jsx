import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

export default function HomeHeroSection() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Discover the World's Celebrations.</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Your guide to the stories, traditions, and dates behind global
        festivals.
      </p>
      <div className="mt-8 flex justify-center">
        <div className="flex w-full max-w-lg items-center space-x-2">
          <Input type="text" placeholder="Find a festival, country, or tradition..." className="flex-1" />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Explore
          </Button>
        </div>
      </div>
    </section>
  );
}
