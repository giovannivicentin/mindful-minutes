"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { Menu, Home, Activity, User, Leaf } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Extract locale from pathname
  const pathParts = pathname.split("/");
  const locale = pathParts.length > 1 && pathParts[1] ? pathParts[1] : "en";

  const t = useTranslation(locale);

  // Determine active tab
  const getActiveTab = () => {
    if (pathname.includes("/practices")) return "practices";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  const routes = [
    {
      name: t("navigation.home"),
      path: `/${locale}`,
      icon: <Home className="h-5 w-5" />,
      value: "home",
    },
    {
      name: t("navigation.practices"),
      path: `/${locale}/practices`,
      icon: <Activity className="h-5 w-5" />,
      value: "practices",
    },
    {
      name: t("navigation.profile"),
      path: `/${locale}/profile`,
      icon: <User className="h-5 w-5" />,
      value: "profile",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo - Left side */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-full">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex">
          <Tabs value={getActiveTab()} className="w-full">
            <TabsList>
              {routes.map((route) => (
                <Link key={route.path} href={route.path}>
                  <TabsTrigger value={route.value} className="flex gap-2">
                    {route.icon}
                    {route.name}
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Right side - Language, Theme, and Mobile Menu */}
        <div className="flex items-center gap-2">
          <LanguageToggle currentLocale={locale} />
          <ThemeToggle locale={locale} />

          {/* Mobile Menu - Right side */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-xl">Mindful Minutes</span>
              </div>
              <div className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
