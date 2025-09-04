import Image from "next/image";
import StoryDetailContent from "@/components/stories/StoryDetailContent";

// Mock data for stories - 基于现有stories页面的数据结构
const mockStories = {
  "history-of-lantern-festivals": {
    slug: "history-of-lantern-festivals",
    title: "The History of Lantern Festivals",
    heroImage: "https://placehold.co/1600x800/1e293b/white?text=Lanterns",
    keyInfo: {
      author: "Jane Doe",
      publishedDate: "March 15, 2024",
      readTime: "8 min read",
      category: "Cultural Deep Dives",
      tags: ["Lanterns", "Asia", "Traditions", "History", "Buddhism"],
    },
    storyContent: [
      { type: 'h2', children: [{ text: 'Ancient Origins' }] },
      { type: 'p', children: [{ text: 'Lantern festivals have illuminated the night skies of Asia for over 2,000 years. What began as simple rituals to ward off evil spirits has evolved into spectacular celebrations that bring communities together in displays of light, color, and hope.' }] },
      { type: 'p', children: [{ text: 'The earliest recorded lantern festivals date back to the Han Dynasty in China, where they were initially used during religious ceremonies. Buddhist monks would light lanterns to honor Buddha, while Taoist practitioners used them in rituals to communicate with deities.' }] },
      { type: 'h2', children: [{ text: 'Cultural Significance Across Asia' }] },
      { type: 'p', children: [{ text: 'Each country has developed its own unique interpretation of lantern festivals. In China, the Lantern Festival marks the end of Chinese New Year celebrations. In Thailand, the Yi Peng festival sees thousands of lanterns released into the night sky as a form of merit-making.' }] },
      { type: 'p', children: [{ text: 'Japan\'s Toro Nagashi involves floating lanterns on water to guide the spirits of ancestors, while South Korea\'s Lotus Lantern Festival celebrates Buddha\'s birthday with elaborate lantern displays throughout Seoul.' }] },
      { type: 'h2', children: [{ text: 'Modern Celebrations' }] },
      { type: 'p', children: [{ text: 'Today\'s lantern festivals blend ancient traditions with contemporary artistry. Modern festivals feature LED-lit installations, interactive displays, and community workshops where visitors can create their own lanterns.' }] },
      { type: 'p', children: [{ text: 'These celebrations have also spread beyond Asia, with cities worldwide hosting their own lantern festivals, creating bridges between cultures and sharing the universal message of hope and renewal that lanterns represent.' }] }
    ],
    gallery: [
      "https://placehold.co/800x600/1e293b/white?text=Ancient+Lanterns",
      "https://placehold.co/800x600/f97316/white?text=Festival+Crowd",
      "https://placehold.co/800x600/22c55e/white?text=Night+Sky",
      "https://placehold.co/800x600/3b82f6/white?text=Traditional+Art",
    ],
  },
  "harvest-festivals-in-autumn": {
    slug: "harvest-festivals-in-autumn",
    title: "10 Harvest Festivals to Visit in Autumn",
    heroImage: "https://placehold.co/1600x800/f97316/white?text=Harvest",
    keyInfo: {
      author: "John Smith",
      publishedDate: "September 22, 2024",
      readTime: "12 min read",
      category: "Travel Guides",
      tags: ["Autumn", "Harvest", "Travel", "Festivals", "Food"],
    },
    storyContent: [
      { type: 'h2', children: [{ text: 'The Magic of Autumn Celebrations' }] },
      { type: 'p', children: [{ text: 'As leaves turn golden and the air grows crisp, communities around the world gather to celebrate the harvest season. These festivals represent humanity\'s oldest traditions, honoring the earth\'s bounty and the hard work of farmers.' }] },
      { type: 'h2', children: [{ text: 'Top 10 Harvest Festivals' }] },
      { type: 'p', children: [{ text: '1. Oktoberfest, Germany - The world\'s largest beer festival celebrating the hop harvest.' }] },
      { type: 'p', children: [{ text: '2. Thanksgiving, USA - A national celebration of gratitude and harvest abundance.' }] },
      { type: 'p', children: [{ text: '3. Vendanges, France - Grape harvest festivals in wine regions across the country.' }] },
      { type: 'p', children: [{ text: '4. Chuseok, South Korea - A major harvest festival honoring ancestors.' }] },
      { type: 'p', children: [{ text: '5. Pongal, India - Tamil harvest festival celebrating rice cultivation.' }] }
    ],
    gallery: [
      "https://placehold.co/800x600/f97316/white?text=Autumn+Leaves",
      "https://placehold.co/800x600/eab308/white?text=Harvest+Time",
      "https://placehold.co/800x600/dc2626/white?text=Festival+Food",
      "https://placehold.co/800x600/16a34a/white?text=Celebration",
    ],
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = mockStories[slug] || mockStories["history-of-lantern-festivals"];
  
  return {
    title: `${story.title} | DayCal Stories`,
    description: `Read about ${story.title} - ${story.keyInfo.category}`,
  };
}

export default async function StoryDetailPage({ params }) {
  // In a real app, you would fetch story data based on `params.slug`
  const { slug } = await params;
  const story = mockStories[slug] || mockStories["history-of-lantern-festivals"];

  return (
    <article>
      {/* Hero Section - 完全按照节日详情页的模式 */}
      <section className="relative w-full h-[50vh] text-white">
        <Image 
          src={story.heroImage} 
          alt={story.title} 
          layout="fill" 
          objectFit="cover" 
          unoptimized={true} 
          priority 
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold max-w-4xl">{story.title}</h1>
        </div>
      </section>

      <StoryDetailContent story={story} />
      
    </article>
  );
}