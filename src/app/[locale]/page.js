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
import { getBaseUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  
  const titles = {
    en: 'AI Prompt Generators - Free AI Prompt Optimization Tools',
    zh: 'AI提示词生成器 - 免费AI提示词优化工具',
    ja: 'AIプロンプトジェネレーター - 無料AIプロンプト最適化ツール',
    ko: 'AI 프롬프트 생성기 - 무료 AI 프롬프트 최적화 도구',
    fr: 'Générateurs de Prompts IA - Outils d\'Optimisation de Prompts IA Gratuits',
    es: 'Generadores de Prompts IA - Herramientas de Optimización de Prompts IA Gratuitas',
    pt: 'Geradores de Prompts IA - Ferramentas de Otimização de Prompts IA Gratuitas',
    de: 'KI-Prompt-Generatoren - Kostenlose KI-Prompt-Optimierungstools'
  };

  const descriptions = {
    en: 'Transform your ideas into powerful AI prompts with Kari\'s 4-D optimization methodology. Free tools for ChatGPT, Midjourney, writing, art, and more.',
    zh: '使用Kari的4-D优化方法论将您的想法转化为强大的AI提示词。免费工具适用于ChatGPT、Midjourney、写作、艺术等。',
    ja: 'Kariの4-D最適化方法論でアイデアを強力なAIプロンプトに変換。ChatGPT、Midjourney、ライティング、アートなどの無料ツール。',
    ko: 'Kari의 4-D 최적화 방법론으로 아이디어를 강력한 AI 프롬프트로 변환하세요. ChatGPT, Midjourney, 글쓰기, 아트 등을 위한 무료 도구.',
    fr: 'Transformez vos idées en prompts IA puissants avec la méthodologie d\'optimisation 4-D de Kari. Outils gratuits pour ChatGPT, Midjourney, écriture, art et plus.',
    es: 'Transforma tus ideas en prompts IA poderosos con la metodología de optimización 4-D de Kari. Herramientas gratuitas para ChatGPT, Midjourney, escritura, arte y más.',
    pt: 'Transforme suas ideias em prompts IA poderosos com a metodologia de otimização 4-D da Kari. Ferramentas gratuitas para ChatGPT, Midjourney, escrita, arte e mais.',
    de: 'Verwandeln Sie Ihre Ideen in mächtige KI-Prompts mit Karis 4-D-Optimierungsmethodik. Kostenlose Tools für ChatGPT, Midjourney, Schreiben, Kunst und mehr.'
  };

  const canonicalUrl = `${baseUrl}/${locale}`;
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: 'AI prompt generator, prompt optimizer, ChatGPT prompts, Midjourney prompts, AI tools, prompt engineering, Kari AI',
    authors: [{ name: 'Kari AI' }],
    creator: 'Kari AI',
    publisher: 'Kari AI',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        zh: `${baseUrl}/zh`,
        ja: `${baseUrl}/ja`,
        ko: `${baseUrl}/ko`,
        fr: `${baseUrl}/fr`,
        es: `${baseUrl}/es`,
        pt: `${baseUrl}/pt`,
        de: `${baseUrl}/de`,
      }
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: canonicalUrl,
      siteName: 'Kari AI Prompt Generators',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image-home.jpg`,
          width: 1200,
          height: 630,
          alt: titles[locale] || titles.en,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      creator: '@KariAI',
      images: [`${baseUrl}/og-image-home.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

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

export default async function Home({ params }) {
  const { locale } = await params;
  const t = useTranslations('HomePage');
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kari AI Prompt Generators',
    description: 'Free AI prompt optimization tools for ChatGPT, Midjourney, writing, art, and more.',
    url: `${getBaseUrl()}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getBaseUrl()}/${locale}?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'Kari AI',
      url: getBaseUrl()
    }
  };
  const generators = [
      { 
        name: "Writing Prompt Generator", 
        slug: "writing-prompt-generator", 
        description: "Generate creative writing prompts with Kari AI optimization.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2940&auto=format&fit=crop",
        tags: ["Writing", "Creative", "AI"]
      },
      { 
        name: "Art Prompt Generator", 
        slug: "art-prompt-generator", 
        description: "Create stunning art prompts for AI image generation.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2940&auto=format&fit=crop",
        tags: ["Art", "Visual", "AI"]
      },
      { 
        name: "AI Prompt Generator", 
        slug: "ai-prompt-generator", 
        description: "Universal AI prompt optimizer for any platform.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2940&auto=format&fit=crop",
        tags: ["AI", "Universal", "Optimization"]
      },
      { 
        name: "ChatGPT Prompt Generator", 
        slug: "chatgpt-prompt-generator", 
        description: "Optimize your prompts specifically for ChatGPT.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop",
        tags: ["ChatGPT", "Optimization", "AI"]
      },
      { 
        name: "Midjourney Prompt Generator", 
        slug: "midjourney-prompt-generator", 
        description: "Generate perfect prompts for Midjourney image creation.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2940&auto=format&fit=crop",
        tags: ["Midjourney", "Image", "AI"]
      },
      { 
        name: "Drawing Prompt Generator", 
        slug: "drawing-prompt-generator", 
        description: "Inspire your creativity with drawing prompt suggestions.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2940&auto=format&fit=crop",
        tags: ["Drawing", "Creative", "Art"]
      },
      { 
        name: "AI Video Prompt Generator", 
        slug: "ai-video-prompt-generator", 
        description: "Create optimized prompts for AI video generation tools.", 
        author: "Kari AI", 
        authorImage: "/kari-avatar.png",
        imageSrc: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2940&auto=format&fit=crop",
        tags: ["Video", "AI", "Creative"]
      },
  ];

  const filterOptions = {
    "Category": ["SaaS", "Portfolio", "Ecommerce", "Blog", "Community"],
    "Style": ["Minimalist", "Modern", "Brutalist", "Corporate"],
    "Tech": ["Next.js", "Gatsby", "Wordpress", "Shopify"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-black">
            AI Prompt Generators
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into powerful AI prompts with Kari's 4-D optimization methodology. Get better results from ChatGPT, Midjourney, and more.
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
              {generators.map((generator) => (
                <SiteCard key={generator.name} {...generator} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
    </>
  );
}
