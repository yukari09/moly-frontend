import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowRightCircle } from "lucide-react"

export const metadata = {
  title: "Home | Moly's Blog",
  description: "Welcome to Moly's Blog. Here we share our thoughts on web development, design, and more.",
};

const posts = [
    {
        title: "The Future of Web Development",
        description: "A look into the trends and technologies shaping the future of web development.",
        author: "Jane Doe",
        date: "2024-09-03",
        tags: ["Web Development", "Future", "Technology"],
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
        title: "A Guide to Shadcn UI",
        description: "Learn how to use Shadcn UI to build beautiful and accessible UIs.",
        author: "John Smith",
        date: "2024-09-02",
        tags: ["Shadcn UI", "React", "Tailwind CSS"],
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
        title: "The Importance of SEO",
        description: "Discover why SEO is crucial for your website's success.",
        author: "Peter Jones",
        date: "2024-09-01",
        tags: ["SEO", "Marketing"],
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
        title: "Getting Started with Next.js",
        description: "A beginner's guide to building applications with Next.js.",
        author: "Alice Johnson",
        date: "2024-08-30",
        tags: ["Next.js", "React", "JavaScript"],
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
        title: "The Power of Tailwind CSS",
        description: "Learn how Tailwind CSS can streamline your styling workflow.",
        author: "David Chen",
        date: "2024-08-29",
        tags: ["Tailwind CSS", "CSS", "Web Design"],
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
        title: "Building a Blog with Gemini",
        description: "A step-by-step guide to creating a blog using Gemini.",
        author: "Emily White",
        date: "2024-08-28",
        tags: ["Gemini", "AI", "Content Creation"],
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
];

const featuredPost = posts[0];
const otherPosts = posts.slice(1);

export default function Home() {
    return (
      <div className="min-h-screen bg-white">
        <main className="flex flex-1 flex-col">
          <section className="border-grid">
            <div className="container-wrapper">
              <div className="mx-auto flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
                {/* <Badge variant="secondary animation">
                  <Link href="/" className="flex items-center gap-2">New Website Build By Moly <ArrowRightCircle className="size-4"/></Link>
                </Badge> */}
                <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                  Day Festival And Calendar
                </h1>
                <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
                  Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever.
                </p>
                {/* <div className="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">
                  <a href="#blocks" data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5">Browse Blocks</a>
                  <a data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5" href="/docs/blocks">Add a block</a>
                </div> */}
              </div>
            </div>
          </section>
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mt-12">
            <h2 class="text-primary leading-tighter text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter">Featured Posts</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              <article class="flex flex-col gap-4">
                <Image src="/12.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>
              <div class="flex flex-col gap-8">
                <article class="flex gap-4">
                  <Image src="/14.jpg" width="320" height="180" className="aspect-[2/1] rounded-sm object-cover" />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                    <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                    <p className="line-clamp-2 text-muted-foreground">
                      I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                    </p>
                    <Badge variant="secondary">Ai Content</Badge>
                  </div>
                </article>

                <article class="flex gap-4">
                  <Image src="/18.jpg" width="320" height="180" className="aspect-[2/1] rounded-sm object-cover" />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                    <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                    <p className="line-clamp-2 text-muted-foreground">
                      I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                    </p>
                    <Badge variant="secondary">Ai Content</Badge>
                  </div>
                </article>
                
              </div>
            </div>
          </section>
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mt-28 mb-8">
            <h2 class="text-primary leading-tighter text-2xl font-semibold tracking-tight lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter">Latest Posts</h2>
            <div className="grid grid-cols-3 gap-8 mt-8">
              <article class="flex flex-col gap-4">
                <Image src="/11.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm object-cover" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>
              <article class="flex flex-col gap-4">
                <Image src="/12.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>
              <article class="flex flex-col gap-4">
                <Image src="/12.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>

              <article class="flex flex-col gap-4">
                <Image src="/14.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>

              <article class="flex flex-col gap-4">
                <Image src="/05.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm object-cover" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>

              <article class="flex flex-col gap-4">
                <Image src="/19.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm object-cover" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>

              <article class="flex flex-col gap-4">
                <Image src="/19.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm object-cover" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>

              <article class="flex flex-col gap-4">
                <Image src="/18.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm object-cover" />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                  <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                  <p className="line-clamp-2 text-muted-foreground">
                    I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                  </p>
                  <Badge variant="secondary">Ai Content</Badge>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    );
}