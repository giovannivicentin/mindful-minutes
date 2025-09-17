"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";

export function Footer() {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const locale = pathParts.length > 1 && pathParts[1] ? pathParts[1] : "en";

  const t = useTranslation(locale);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative border-t bg-background/70 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
        overflow-hidden
      "
      aria-labelledby="site-footer-title"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_80%_at_50%_120%,black,transparent)]">
        <div className="absolute -bottom-24 left-1/2 h-56 w-[48rem] -translate-x-1/2 rounded-[100%] blur-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      </div>
      <div className="container mx-auto px-6 py-8">
        <h2 id="site-footer-title" className="sr-only">
          {t("footer.builtBy")}
        </h2>

        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center gap-2 text-sm text-muted-foreground/90">
            <span className="font-light">{t("footer.builtBy")}</span>
            <Link
              href="https://giovannivicentin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center font-semibold text-foreground/90 transition-transform duration-300 hover:text-primary hover:scale-[1.02] focus-visible:outline-none"
            >
              <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Giovanni Vicentin
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0 scale-x-0 transition-transform duration-300 origin-center group-hover:scale-x-100" />
            </Link>
          </div>

          <div className="flex w-full max-w-sm items-center sm:hidden">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/40 to-border/70" />
            <div className="mx-2 h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50" />
            <div className="flex-1 h-px bg-gradient-to-r from-border/70 via-border/40 to-transparent" />
          </div>

          <p className="text-xs text-muted-foreground/70 font-light tracking-[0.12em] uppercase sm:tracking-wider">
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
