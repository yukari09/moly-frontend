import { Triangle, Github, Twitter, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useTranslations} from 'next-intl';


const footerLinks = {
    "Legal": [
      {"Privacy Policy": "/privacy"},
      {"Terms of Service": "/terms"}
    ],
  }

export default function Footer() {
  const t = useTranslations('WebSite');
    return (
      <footer className="mt-20 border-t">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="py-16 grid grid-cols-1 xl:grid-cols-6 gap-4 xl:gap-20">
            <div className="xl:col-span-2 space-y-4">
              <Image src="/logo.svg" width="32" height="32" alt="" />
              <p className="text-muted-foreground">{t.rich("websiteInfo")}</p>
              <div className="flex items-center gap-4">
                  <a href="#" aria-label="Github">
                      <Github className="w-5 h-5" />
                  </a>
                  <a href="#" aria-label="Twitter">
                      <Twitter className="w-5 h-5" />
                  </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 col-span-4">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h4 className="font-semibold text-primary">{title}</h4>
                  <ul className="mt-4 space-y-3">
                    {links.map((linkObj, i) => {
                      const [label, href] = Object.entries(linkObj)[0];
                      return (
                        <li key={i}>
                          <Link href={href} className="text-muted-foreground">
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

          </div>
          <div className="border-t">
            <div className="max-w-screen-2xl mx-auto px-6">
              <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm">© 2025 {t.rich("name")}, Inc.</p>
                <Link className="text-sm flex items-center" href="/"><ArrowUp className="size-4"/>Back to top</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}