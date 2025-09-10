"use client";

import { ChevronDown, LucideGlobe, Triangle, User } from "lucide-react";
import { Button,ListItem } from "@/components/ui/button";
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
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { getMetaValue } from "@/lib/utils";
import {useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';
import { routing } from '@/i18n/routing';


const languageNames = {
  en: 'English',
  ko: '한국어',
  zh: '中文',
  ja: '日本語',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
};

function LanguageSwitcher() {
  const params = useParams();
  const locale = params.locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" >
          <LucideGlobe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem key={l} onClick={() => handleLocaleChange(l)}>
            {languageNames[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
    <header>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-[65px]">
        <div className="flex justify-between items-center gap-3 sm:gap-6 sticky py-4">
          <div className="flex-1 flex items-center gap-8">
            <Link href="/">
              <Image 
                src="/logo.svg"
                height="32"
                width="32"
              />
            </Link>

            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
  
                  <NavigationMenuItem>
                    
                      <NavigationMenuLink asChild>
                        <Link href="/" className="font-medium" >Home</Link>
                      </NavigationMenuLink>
                    
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    
                      <NavigationMenuLink asChild>
                        <Link href="/latest" className="font-medium">{t.rich("latest")}</Link>
                      </NavigationMenuLink>
                    
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    
                      <NavigationMenuLink asChild>
                        <Link href="/tags" className="font-medium">{t.rich("tags")}</Link>
                      </NavigationMenuLink>
                    
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end width-1/2">
            {status === "loading" && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 sm:w-20 rounded-md bg-gray-200 animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              </div>
            )}
            {status === "unauthenticated" && (
              <>
                <LanguageSwitcher />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => signIn()}
                >
                  <span className="hidden sm:inline">{t.rich('log_in')}</span>
                  <span className="sm:hidden">Login</span>
                </Button>
                <Button asChild variant="default" size="sm" >
                  <Link href="/register">
                    <span className="hidden sm:inline">{t.rich('sign_up')}</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
            {status === "authenticated" && (
              <>
              <LanguageSwitcher />
               
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="size-8 cursor-pointer">
                    <AvatarImage src={avatarUrl || ""} alt={name || ""} />
                    <AvatarFallback>
                      {name ? (
                            name.slice(0, 1).toUpperCase()
                          ) : (
                            <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


