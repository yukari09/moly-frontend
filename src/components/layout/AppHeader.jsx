import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Festivals" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contribute", label: "Contribute" },
];

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">DayCal</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Add mobile menu button and user auth button here in the future */}
      </div>
    </header>
  );
}
