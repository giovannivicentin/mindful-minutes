import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import Navigation from "@/components/navigation";
import { dictionaries } from "@/dictionaries";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mindful Minutes",
  description: "Quick sessions to lower anxiety, stress and prevent burnout",
  manifest: "/manifest.json",
  generator: "v0.dev",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const locale = params.locale || "en";

  // Check if the locale is Arabic to set RTL direction
  const isRtl = locale === "ar";

  // Validate that the locale exists in our dictionaries
  const validLocale = Object.keys(dictionaries).includes(locale)
    ? locale
    : "en";

  return (
    <html
      lang={validLocale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <I18nProvider locale={validLocale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
