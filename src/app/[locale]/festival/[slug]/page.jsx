import Image from "next/image";
import FestivalDetailContent from "@/components/festival/FestivalDetailContent";

// Mock data for a single festival page
const festival = {
  slug: "holi-festival-of-colors",
  title: "Holi - The Festival of Colors",
  heroImage: "https://placehold.co/1600x800/f97316/white?text=Holi+Celebration",
  keyInfo: {
    date: "March 14, 2025",
    location: "Vrindavan, India",
    type: "Cultural, Religious",
    tags: ["Family-Friendly", "Outdoors", "Colors"],
  },
  storyContent: [
    { type: 'h2', children: [{ text: 'The Legend of Holi' }] },
    { type: 'p', children: [{ text: 'Holi, known as the festival of colors, is one of the most vibrant and joyous festivals in India. Its origins are rooted in Hindu mythology, primarily celebrating the eternal and divine love of Radha and Krishna.' }] },
    { type: 'p', children: [{ text: 'Another significant legend is the story of Prahlada and Holika. It commemorates the victory of good over evil, symbolized by the burning of the demoness Holika in a bonfire on the eve of Holi.' }] },
  ],
  traditionsContent: [
    { type: 'h2', children: [{ text: 'Rituals and Festivities' }] },
    { type: 'p', children: [{ text: 'The celebration begins on the night before Holi with a Holika Dahan where people gather, perform religious rituals in front of a bonfire, and pray that their internal evil be destroyed.' }] },
    { type: 'p', children: [{ text: 'The next morning is a free-for-all carnival of colors, where participants play, chase and color each other with dry powder and colored water, with some carrying water guns and colored water-filled balloons for their water fight.' }] },
  ],
  travelerGuideContent: [
    { type: 'h2', children: [{ text: 'Tips for Travelers' }] },
    { type: 'p', children: [{ text: '1. Wear old clothes as the colors can be difficult to wash out.' }] },
    { type: 'p', children: [{ text: '2. Protect your skin and hair with oil or moisturizer.' }] },
    { type: 'p', children: [{ text: '3. Keep your electronics in waterproof bags.' }] },
  ],
  gallery: [
    "https://placehold.co/800x600/ef4444/white?text=Joyful+Crowd",
    "https://placehold.co/800x600/3b82f6/white?text=Colorful+Powder",
    "https://placehold.co/800x600/22c55e/white?text=Celebration",
    "https://placehold.co/800x600/eab308/white?text=Music+and+Dance",
  ],
};

export default function FestivalDetailPage({ params }) {
  // In a real app, you would fetch festival data based on `params.slug`

  return (
    <article>
      {/* 1. Hero Section */}
      <section className="relative w-full h-[50vh] text-white">
        <Image 
          src={festival.heroImage} 
          alt={festival.title} 
          layout="fill" 
          objectFit="cover" 
          unoptimized={true} 
          priority 
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold max-w-4xl">{festival.title}</h1>
        </div>
      </section>

      <FestivalDetailContent festival={festival} />
      
    </article>
  );
}
