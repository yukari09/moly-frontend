"use client";

import { ChevronDown, LucideGlobe, Triangle, User } from "lucide-react";
import { Button, ListItem } from "@/components/ui/button";
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
import { useRouter, usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { getMetaValue } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { routing } from "@/i18n/routing";

const VercelLogo = () => <Triangle className="w-6 h-6 fill-current" />;

const languageNames = {
  en: "English",
  ko: "한국어",
  zh: "中文",
  ja: "日本語",
  fr: "Français",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
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
        <Button variant="ghost" size="sm">
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
  const t = useTranslations("Header");

  // @ts-ignore
  const userMeta = session?.user?.userMeta;
  const name = getMetaValue(userMeta, "name");
  const username = getMetaValue(userMeta, "username");
  const avatarUrl = getMetaValue(userMeta, "avatar"); // Directly use the full URL

  return (
    <header>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex justify-between items-center h-[65px]">
        <div className="flex items-center gap-3 sm:gap-6 sticky">
          <VercelLogo />
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/#features" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t.rich("features")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/#difference" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t.rich("difference")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/#use-cases" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t.rich("user_case")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {status === "loading" && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 sm:w-20 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-8 w-16 sm:w-20 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          )}
          {status === "unauthenticated" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => signIn()}>
                <span className="hidden sm:inline">{t.rich("log_in")}</span>
                <span className="sm:hidden">Login</span>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/register">
                  <span className="hidden sm:inline">{t.rich("sign_up")}</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={avatarUrl || ""} alt={name || ""} />
                  <AvatarFallback>
                    {" "}
                    {name ? (
                      name.charAt(0).toUpperCase()
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
                  {t.rich("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/account/profile")}
                >
                  {t.rich("setting")}
                </DropdownMenuItem>
                {process.env.NODE_ENV === "development" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/debug/session")}
                  >
                    {t.rich("debug_session")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/auth/signout")}>
                  {t.rich("log_out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
