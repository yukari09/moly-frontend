"use client";

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
import { TemplateCard } from "@/components/TemplateCard";

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
  const templates = [
      { name: "Next.js Boilerplate", slug: "next-js-boilerplate", description: "Get started with Next.js and React in seconds.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/next-js-boilerplate/image" },
      { name: "Image Gallery Starter", slug: "image-gallery-starter", description: "An image gallery built on Next.js and Cloudinary.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/image-gallery-starter/image" },
      { name: "Next.js AI Chatbot", slug: "next-ai-chatbot", description: "A full-featured, hackable Next.js AI chatbot built by Vercel.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/next-ai-chatbot/image" },
      { name: "Nextra: Docs Starter Kit", slug: "docs-starter-kit", description: "Simple, powerful and flexible markdown-powered docs site. Built with Next.js.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/docs-starter-kit/image" },
      { name: "Hume AI - Empathic Voice Interface Starter", slug: "empathic-voice-interface", description: "This template creates a voice chat using Hume AI's Empathic Voice Interface.", author: "Hume AI", imageSrc: "https://vercel.com/templates/next.js/empathic-voice-interface/image" },
      { name: "Next.js Commerce", slug: "commerce-shopify", description: "Starter kit for high-performance commerce with Shopify.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/commerce-shopify/image" },
  ];

  const filterOptions = {
    "Use Case": ["AI", "Starter", "Ecommerce", "SaaS", "Blog", "Portfolio"],
    "Framework": ["Next.js"],
    "CSS": ["Tailwind CSS"],
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-black">
            Next.js starter templates <br /> and themes
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover Next.js templates, starters, and themes to jumpstart your
            application or website build.
          </p>
        </div>

        <div className="flex gap-10">
          <aside className="w-1/4 max-w-[280px] hidden md:block">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-base text-black">Filter Templates</h2>
              <Button variant="link" className="text-gray-600 p-0 h-auto hover:text-black">Clear</Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-9 h-10 border-gray-200 rounded-lg" />
            </div>

            <Accordion type="multiple" className="w-full" defaultValue={["Use Case"]}>
              {Object.entries(filterOptions).map(([title, options]) => (
                <FilterSection key={title} title={title} options={options} />
              ))}
            </Accordion>
          </aside>
          
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <TemplateCard key={template.name} {...template} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
