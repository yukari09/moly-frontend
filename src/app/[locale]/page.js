import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SiteCard } from "@/components/SiteCard";

import {useTranslations} from 'next-intl';

const FilterSection = ({ title, options }) => (
  <AccordionItem value={title} className="border-b border-gray-200">
    <AccordionTrigger className="py-4 text-base font-medium hover:no-underline text-black">
      {title}
    </AccordionTrigger>
    <AccordionContent className="pb-4">
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-3">
            <Checkbox id={`${title}-${option}`} className="w-4 h-4 rounded-[4px] border-gray-300" />
            <label
              htmlFor={`${title}-${option}`}
              className="text-base font-normal text-gray-600"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
);

export default function Home() {
  const t = useTranslations('HomePage');
  const sites = [
      { 
        name: "Stripe", 
        slug: "stripe", 
        description: "Online payment processing for internet businesses.", 
        author: "Stripe", 
        authorImage: "https://avatars.githubusercontent.com/u/139536?s=200&v=4",
        imageSrc: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2832&auto=format&fit=crop",
        tags: ["SaaS", "Payments", "Fintech"]
      },
      { 
        name: "Linear", 
        slug: "linear", 
        description: "The issue tracking tool you'll enjoy using.", 
        author: "Linear", 
        authorImage: "https://avatars.githubusercontent.com/u/35640035?s=200&v=4",
        imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
        tags: ["SaaS", "Developer Tools"]
      },
      { 
        name: "Vercel", 
        slug: "vercel", 
        description: "Develop, Preview, Ship. For the best frontend teams.", 
        author: "Vercel", 
        authorImage: "https://avatars.githubusercontent.com/u/14985020?s=200&v=4",
        imageSrc: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
        tags: ["Hosting", "PaaS", "Next.js"]
      },
      { 
        name: "Loom", 
        slug: "loom", 
        description: "Video messaging for work.", 
        author: "Loom", 
        authorImage: "https://avatars.githubusercontent.com/u/11398433?s=200&v=4",
        imageSrc: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2940&auto=format&fit=crop",
        tags: ["Video", "Productivity"]
      },
      { 
        name: "Figma", 
        slug: "figma", 
        description: "The collaborative interface design tool.", 
        author: "Figma", 
        authorImage: "https://avatars.githubusercontent.com/u/5153879?s=200&v=4",
        imageSrc: "https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=2940&auto=format&fit=crop",
        tags: ["Design", "SaaS", "Collaboration"]
      },
      { 
        name: "Notion", 
        slug: "notion", 
        description: "The all-in-one workspace for your notes, tasks, wikis, and databases.", 
        author: "Notion", 
        authorImage: "https://avatars.githubusercontent.com/u/1 Notion?s=200&v=4",
        imageSrc: "https://images.unsplash.com/photo-1600195077909-46e573870d99?q=80&w=2875&auto=format&fit=crop",
        tags: ["Productivity", "Notes", "Docs"]
      },
  ];

  const filterOptions = {
    "Category": ["SaaS", "Portfolio", "Ecommerce", "Blog", "Community"],
    "Style": ["Minimalist", "Modern", "Brutalist", "Corporate"],
    "Tech": ["Next.js", "Gatsby", "Wordpress", "Shopify"],
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-black">
            {t.rich('title')}
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best websites on the internet. A curated gallery of inspiration and creativity.
          </p>
        </div>

        <div className="flex gap-10">
          <aside className="w-1/4 max-w-[280px] hidden md:block">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-base text-black">Filters</h2>
              <Button variant="link" className="text-gray-600 p-0 h-auto hover:text-black">Clear</Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-9 h-10 border-gray-200 rounded-lg" />
            </div>

            <Accordion type="multiple" className="w-full" defaultValue={["Category"]}>
              {Object.entries(filterOptions).map(([title, options]) => (
                <FilterSection key={title} title={title} options={options} />
              ))}
            </Accordion>
          </aside>
          
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => (
                <SiteCard key={site.name} {...site} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
