import { Triangle, Github, Twitter, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const VercelLogo = () => <Triangle className="w-6 h-6 fill-current" />;

const footerLinks = {
    "Products": ["Pro", "Teams", "Pricing", "Vercel/Ship", "Documentation"],
    "Resources": ["Next.js", "Examples", "Integrations", "Guides", "Blog"],
    "Company": ["Home", "About", "Careers", "Contact Us"],
    "Legal": ["Privacy Policy", "Terms of Service"],
  }

export default function Footer() {
    return (
      <footer className="mt-20 border-t">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="py-16 grid grid-cols-6 gap-20">
            <div className="col-span-2 space-y-4">
              <Image src="/logo.svg" width="32" height="32" />
              <p className="text-muted-foreground">Features productivity, tips, inspiration and strategies for massive profits. Find out how to set up a successful blog or how to make yours even better!</p>
              <div className="flex items-center gap-4">
                  <a href="#" aria-label="Github">
                      <Github className="w-5 h-5" />
                  </a>
                  <a href="#" aria-label="Twitter">
                      <Twitter className="w-5 h-5" />
                  </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 col-span-4">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h4 className="font-semibold text-primary">{title}</h4>
                  <ul className="mt-4 space-y-3">
                    {links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-muted-foreground">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
          <div className="border-t">
            <div className="max-w-screen-2xl mx-auto px-6">
              <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm">© 2025 Vercel, Inc.</p>
                <Link className="text-sm flex items-center" href="/"><ArrowUp className="size-4"/>Back to top</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}