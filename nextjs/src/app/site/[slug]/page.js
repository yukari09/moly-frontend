import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/TemplateCard";

// --- Data ---
// In a real app, this would likely come from a CMS or database
const templates = [
    { name: "Next.js Boilerplate", slug: "next-js-boilerplate", description: "Get started with Next.js and React in seconds.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/next-js-boilerplate/image" },
    { name: "Image Gallery Starter", slug: "image-gallery-starter", description: "An image gallery built on Next.js and Cloudinary.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/image-gallery-starter/image" },
    { name: "Next.js AI Chatbot", slug: "next-ai-chatbot", description: "A full-featured, hackable Next.js AI chatbot built by Vercel.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/next-ai-chatbot/image" },
    { name: "Nextra: Docs Starter Kit", slug: "docs-starter-kit", description: "Simple, powerful and flexible markdown-powered docs site. Built with Next.js.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/docs-starter-kit/image" },
    { name: "Hume AI - Empathic Voice Interface Starter", slug: "empathic-voice-interface", description: "This template creates a voice chat using Hume AI's Empathic Voice Interface.", author: "Hume AI", imageSrc: "https://vercel.com/templates/next.js/empathic-voice-interface/image" },
    { name: "Next.js Commerce", slug: "commerce-shopify", description: "Starter kit for high-performance commerce with Shopify.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/commerce-shopify/image" },
];

const imageGallery = [
  "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580287292364-4bbb22d01959?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd51725?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543286991-34338f864473?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2568&auto=format&fit=crop",
];

const relatedTemplates = [
    { name: "Next.js Boilerplate", slug: "next-js-boilerplate", description: "Get started with Next.js and React in seconds.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/next-js-boilerplate/image" },
    { name: "Platforms Starter Kit", slug: "platforms-starter-kit", description: "Next.js template for building multi-tenant applications with the App Router.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/platforms-starter-kit/image" },
    { name: "Tailwind CSS Blog", slug: "blog-template", description: "Next.js blog using Markdown for content.", author: "Timothy Lin", imageSrc: "https://vercel.com/templates/next.js/blog-template/image" },
    { name: "On-Demand ISR", slug: "on-demand-isr", description: "Instantly update content without redeploying.", author: "Vercel", imageSrc: "https://vercel.com/templates/next.js/on-demand-isr/image" },
]

// --- Helper Components ---
const CodeBlock = ({ children }) => (
    <pre className="bg-gray-100 rounded-lg p-4 text-sm text-gray-800 border border-gray-200">
        <code>{children}</code>
    </pre>
)

// --- Page Generation ---
export async function generateStaticParams() {
  return templates.map((template) => ({
    slug: template.slug,
  }))
}

// --- Page Component ---
export default function SitePage({ params }) {
  const template = templates.find((t) => t.slug === params.slug);

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="py-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} />
            <span>Back to Templates</span>
          </Link>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter text-black">
              {template.name}
            </h1>
            <p className="text-gray-600">
              {template.description}
            </p>
            <div className="flex items-center gap-4">
              <Button className="bg-black text-white h-10 px-6">Deploy</Button>
              <Button variant="outline" className="h-10 px-6 border-gray-300">
                View Demo
              </Button>
            </div>
            <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Repository</span>
                    <a href="#" className="flex items-center gap-2 text-black hover:text-gray-700">
                        <Github size={16} />
                        <span>vercel/next.js</span>
                    </a>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Framework</span>
                    <span className="text-black">Next.js</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Use Case</span>
                    <span className="text-black">Starter</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">CSS</span>
                    <span className="text-black">Tailwind</span>
                </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-3 gap-1">
                    {imageGallery.map((src, i) => (
                        <div key={i} className="bg-gray-100 aspect-square">
                            <img src={src} alt={`Gallery image ${i+1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-12 prose prose-gray max-w-none">
                <h2 className="text-2xl font-semibold text-black">Next.js & Cloudinary example app</h2>
                <p>This example shows how to create an image gallery site using Next.js, <a href="#">Cloudinary</a>, and <a href="#">Tailwind</a>.</p>
                
                <h3 className="text-xl font-semibold text-black">Deploy your own</h3>
                <p>Deploy the example using <a href="#">Vercel</a> or view the demo <a href="#">here</a>.</p>
                <p>Check out our <a href="#">Next.js deployment documentation</a> for more details.</p>

                <h3 className="text-xl font-semibold text-black">How to use</h3>
                <p>Execute <a href="#">create-next-app</a> with <a href="#">npm</a>, <a href="#">Yarn</a>, or <a href="#">pnpm</a> to bootstrap the example:</p>
                <CodeBlock>
                    npx create-next-app --example with-cloudinary with-cloudinary-app
                </CodeBlock>
                 <CodeBlock>
                    yarn create next-app --example with-cloudinary with-cloudinary-app
                </CodeBlock>
                 <CodeBlock>
                    pnpm create next-app --example with-cloudinary with-cloudinary-app
                </CodeBlock>

                <h3 className="text-xl font-semibold text-black">References</h3>
                <p>Cloudinary API: <a href="https://cloudinary.com/documentation/transformation_reference">https://cloudinary.com/documentation/transformation_reference</a></p>
            </div>
          </div>
        </main>

        <section className="mt-24 pt-16 border-t border-gray-200">
            <h2 className="text-2xl font-semibold tracking-tighter text-center text-black">Related Templates</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTemplates.map(template => (
                    <TemplateCard key={template.name} {...template} />
                ))}
            </div>
        </section>

        <section className="my-24">
            <div className="bg-black text-white rounded-lg p-12 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter">Unleash New Possibilities</h2>
                    <p className="mt-2 text-gray-400">Deploy your app on Vercel and unlock its full potential</p>
                </div>
                <Button variant="secondary" className="mt-6 md:mt-0 bg-white text-black h-12 px-6">
                    Try Vercel Free
                </Button>
            </div>
        </section>
      </div>
    </div>
  );
}