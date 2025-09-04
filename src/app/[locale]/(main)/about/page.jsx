import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "A lifelong traveler and cultural enthusiast, Alex founded DayCal to share the world's celebrations with everyone.",
    avatarUrl: "https://placehold.co/100x100/6366f1/white?text=AJ"
  },
  {
    name: "Maria Garcia",
    role: "Lead Content Strategist",
    bio: "Maria is a storyteller and historian who ensures every festival on DayCal is presented with accuracy and respect.",
    avatarUrl: "https://placehold.co/100x100/ec4899/white?text=MG"
  },
  {
    name: "Kenji Tanaka",
    role: "Lead Engineer",
    bio: "Kenji brings the vision of DayCal to life with clean, efficient, and beautiful code.",
    avatarUrl: "https://placehold.co/100x100/10b981/white?text=KT"
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="text-center py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Connecting the World, One Celebration at a Time.</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            DayCal is more than a calendar. It's a window into the soul of global communities, a platform for discovery, and a celebration of human culture.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <Image 
              src="https://placehold.co/800x600/334155/white?text=Our+Journey"
              alt="A collage of festival images"
              layout="fill"
              objectFit="cover"
              unoptimized={true}
            />
          </div>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-serif font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              It started with a simple question: "What are people celebrating around the world today?" We found that finding the answer was surprisingly difficult. Information was scattered, often outdated, and rarely captured the true spirit of the events.
            </p>
            <p className="mb-4">
              We created DayCal to solve that problem. We believe that understanding and participating in cultural traditions is a powerful way to foster empathy and connection. Our mission is to build the most comprehensive and authentic guide to the world's festivals, making cultural exploration accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Our Team Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.match(/\b\w/g).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold font-serif">{member.name}</h3>
                  <p className="text-primary font-semibold mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Join Us Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-serif font-bold mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground mb-8">
            Help us build the world's most comprehensive guide to cultural celebration. If you're a writer, photographer, or simply a cultural enthusiast, we'd love to hear from you.
          </p>
          <Button asChild size="lg">
            <Link href="/contribute">Contribute to DayCal</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}