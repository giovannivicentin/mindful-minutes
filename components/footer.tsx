"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export function Footer({ locale }: { locale: string }) {
  const t = useTranslation(locale);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground/90">
            <span className="font-light">{t("footer.builtBy")} </span>
            <Link
              href="https://giovannivicentin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-semibold text-foreground/90 transition-all duration-300 hover:text-primary hover:scale-105"
            >
              <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Giovanni Vicentin
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 scale-x-0 transition-all duration-300 group-hover:scale-x-100 rounded-full" />
            </Link>
          </div>

          <div className="flex items-center gap-2 w-full max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/30 to-border/60" />
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-r from-border/60 via-border/30 to-transparent" />
          </div>
          <p className="text-xs text-muted-foreground/60 font-light tracking-wider">
            {t("footer.copyright", {
              year: String(currentYear),
              app: "Mindful Minutes",
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
