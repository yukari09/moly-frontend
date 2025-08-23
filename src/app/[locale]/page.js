import Header from "@/components/layout-header";
import Footer from "@/components/layout-footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRightCircle } from "lucide-react";

import {useTranslations} from 'next-intl';


export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <>
    <Header />
    <div className="min-h-screen bg-white">
      <main className="flex flex-1 flex-col">
        <section className="border-grid">
          <div className="container-wrapper">
            <div className="mx-auto flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
              <Badge variant="secondary animation">
                <Link href="/" className="flex items-center gap-2">New Website Build By Moly <ArrowRightCircle className="size-4"/></Link>
              </Badge>
              <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                Building Blocks for the Web
              </h1>
              <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
                Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever.
              </p>
              <div className="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">
                <a href="#blocks" data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5">Browse Blocks</a>
                <a data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5" href="/docs/blocks">Add a block</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer/>
    </>
  );
}
