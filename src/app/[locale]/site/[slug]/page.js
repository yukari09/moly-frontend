import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteCard } from "@/components/SiteCard";

// --- Data ---
// In a real app, this would likely come from a CMS or database
const sites = [
    { name: "Stripe", slug: "stripe", description: "Online payment processing for internet businesses.", author: "Stripe", imageSrc: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2832&auto=format&fit=crop" },
    { name: "Linear", slug: "linear", description: "The issue tracking tool you'll enjoy using.", author: "Linear", imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop" },
    { name: "Vercel", slug: "vercel", description: "Develop, Preview, Ship. For the best frontend teams.", author: "Vercel", imageSrc: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop" },
    { name: "Loom", slug: "loom", description: "Video messaging for work.", author: "Loom", imageSrc: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2940&auto=format&fit=crop" },
    { name: "Figma", slug: "figma", description: "The collaborative interface design tool.", author: "Figma", imageSrc: "https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=2940&auto=format&fit=crop" },
    { name: "Notion", slug: "notion", description: "The all-in-one workspace for your notes, tasks, wikis, and databases.", author: "Notion", imageSrc: "https://images.unsplash.com/photo-1600195077909-46e573870d99?q=80&w=2875&auto=format&fit=crop" },
];

const imageGallery = [
  "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580287292364-4bbb22d01959?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd51725?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543286991-34338f864473?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2568&auto=format&fit=crop",
];

const relatedSites = sites.slice(0, 4);

// --- Helper Components ---
const CodeBlock = ({ children }) => (
    <pre className="bg-gray-100 rounded-lg p-4 text-sm text-gray-800 border border-gray-200">
        <code>{children}</code>
    </pre>
)

// --- Page Generation ---
export async function generateStaticParams() {
  return sites.map((site) => ({
    slug: site.slug,
  }))
}

// --- Page Component ---
export default function SitePage({ params }) {
  const site = sites.find((s) => s.slug === params.slug);

  if (!site) {
    return <div>Site not found</div>
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
            <span>Back to Sites</span>
          </Link>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter text-black">
              {site.name}
            </h1>
            <p className="text-gray-600">
              {site.description}
            </p>
            <div className="flex items-center gap-4">
              <Button className="bg-black text-white h-10 px-6">Visit Site</Button>
              <Button variant="outline" className="h-10 px-6 border-gray-300">
                View Details
              </Button>
            </div>
            <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Submitter</span>
                    <a href="#" className="flex items-center gap-2 text-black hover:text-gray-700">
                        <Github size={16} />
                        <span>{site.author}</span>
                    </a>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Category</span>
                    <span className="text-black">SaaS</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Style</span>
                    <span className="text-black">Modern</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Tech</span>
                    <span className="text-black">Next.js</span>
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
                <h2 className="text-2xl font-semibold text-black">About {site.name}</h2>
                <p>This is a placeholder description for {site.name}. In a real application, this content would be fetched from a CMS or a database, providing detailed information about the website, its features, and the technology behind it.</p>
                
                <h3 className="text-xl font-semibold text-black">Key Features</h3>
                <ul>
                    <li>Feature A: A brief description of what this feature does.</li>
                    <li>Feature B: How this feature helps the user.</li>
                    <li>Feature C: Another interesting aspect of the site.</li>
                </ul>

                <h3 className="text-xl font-semibold text-black">Tech Stack</h3>
                <p>This site was built with a modern tech stack, including:</p>
                <CodeBlock>
                  - Next.js
                  - React
                  - Tailwind CSS
                  - Vercel
                </CodeBlock>
            </div>
          </div>
        </main>

        <section className="mt-24 pt-16 border-t border-gray-200">
            <h2 className="text-2xl font-semibold tracking-tighter text-center text-black">Related Sites</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedSites.map(site => (
                    <SiteCard key={site.name} {...site} />
                ))}
            </div>
        </section>

        <section className="my-24">
            <div className="bg-black text-white rounded-lg p-12 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter">Explore More</h2>
                    <p className="mt-2 text-gray-400">Browse our collection of inspiring websites.</p>
                </div>
                <Button variant="secondary" className="mt-6 md:mt-0 bg-white text-black h-12 px-6">
                    Browse Sites
                </Button>
            </div>
        </section>
      </div>
    </div>
  );
}
