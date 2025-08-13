"use client";

import { ChevronDown, Triangle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { getMetaValue } from "@/lib/utils";
import {useTranslations} from 'next-intl';


const VercelLogo = () => <Triangle className="w-6 h-6 fill-current" />;

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('Header');

  // @ts-ignore
  const userMeta = session?.user?.userMeta;
  const name = getMetaValue(userMeta, "name");
  const username = getMetaValue(userMeta, "username");
  const avatarUrl = getMetaValue(userMeta, "avatar"); // Directly use the full URL

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 flex justify-between items-center h-[65px]">
        <div className="flex items-center gap-6">
          <VercelLogo />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600">Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <VercelLogo />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Vercel
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Develop, Preview, Ship.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Pro">
                      For individual developers and small teams.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Teams">
                      For collaborative teams with advanced needs.
                    </ListItem>
                    <ListItem href="/docs/primitives/typography" title="Enterprise">
                      For organizations with complex security and compliance requirements.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem title="Vercel for Frontend" href="/docs/primitives/alert-dialog">
                      The developer experience platform for frontend teams.
                    </ListItem>
                    <ListItem title="Vercel for AI" href="/docs/primitives/hover-card">
                      Build, scale, and secure AI apps with Vercel.
                    </ListItem>
                   </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-gray-600"}>
                    Docs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-gray-600"}>
                    {t.rich("pricing")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          {status === "loading" && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-8 w-20 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          )}
          {status === "unauthenticated" && (
            <>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100" onClick={() => signIn()}>
                {t.rich('log_in')}
              </Button>
              <Button asChild variant="default" size="sm" className="h-8 bg-black text-white">
                <Link href="/register">{t.rich('sign_up')}</Link>
              </Button>
            </>
          )}
          {status === "authenticated" && (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl || ""} alt={name || ""} className="object-cover" />
                    <AvatarFallback>
                      {name ? (
                        name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/u/${username}`)}>
                  {t.rich('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/account/profile')}>
                  {t.rich('setting')}
                </DropdownMenuItem>
                {process.env.NODE_ENV === 'development' && (
                  <DropdownMenuItem onClick={() => router.push('/debug/session')}>
                    {t.rich('debug_session')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/auth/signout')}>
                  {t.rich('log_out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

const ListItem = (({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
