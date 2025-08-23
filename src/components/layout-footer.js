import { Triangle, Github, Twitter } from "lucide-react";

const VercelLogo = () => <Triangle className="w-6 h-6 fill-current" />;

const footerLinks = {
    "Products": ["Pro", "Teams", "Pricing", "Vercel/Ship", "Documentation"],
    "Resources": ["Next.js", "Examples", "Integrations", "Guides", "Blog"],
    "Company": ["Home", "About", "Careers", "Contact Us"],
    "Legal": ["Privacy Policy", "Terms of Service"],
  }

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <VercelLogo />
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-sm text-black">{title}</h4>
                <ul className="mt-4 space-y-3">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-600 hover:text-black">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">© 2024 Vercel, Inc.</p>
            <div className="flex items-center gap-4">
                <a href="#" aria-label="Github">
                    <Github className="w-5 h-5 text-gray-500 hover:text-black" />
                </a>
                <a href="#" aria-label="Twitter">
                    <Twitter className="w-5 h-5 text-gray-500 hover:text-black" />
                </a>
            </div>
          </div>
        </div>
      </footer>
    )
}