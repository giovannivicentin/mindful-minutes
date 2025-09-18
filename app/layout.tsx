import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import Navigation from "@/components/navigation";
import { dictionaries } from "@/dictionaries";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mindful Minutes - Transform Your Day with Mindfulness",
  description:
    "Simple, guided mindfulness practices to reduce stress, improve focus, and enhance well-being. Just a few minutes can make all the difference.",
  keywords: [
    "mindfulness",
    "meditation",
    "breathing exercises",
    "stress relief",
    "mental health",
    "wellness",
  ],
  authors: [{ name: "Giovanni Vicentin", url: "https://giovannivicentin.com" }],
  creator: "Giovanni Vicentin",
  publisher: "Giovanni Vicentin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mindfulminutes.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "pt-BR": "/pt-BR",
      "es-ES": "/es",
      "fr-FR": "/fr",
      "de-DE": "/de",
      "zh-CN": "/zh",
      "ja-JP": "/ja",
      "ar-SA": "/ar",
    },
  },
  openGraph: {
    title: "Mindful Minutes - Transform Your Day with Mindfulness",
    description:
      "Simple, guided mindfulness practices to reduce stress, improve focus, and enhance well-being.",
    url: "https://mindfulminutes.giovannivicentin.com",
    siteName: "Mindful Minutes",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mindful Minutes - Mindfulness Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindful Minutes - Transform Your Day with Mindfulness",
    description:
      "Simple, guided mindfulness practices to reduce stress, improve focus, and enhance well-being.",
    creator: "@giovannivicentin",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const locale = params.locale || "en";
  const validLocale = Object.keys(dictionaries).includes(locale)
    ? locale
    : "en";
  return (
    <html lang={validLocale} suppressHydrationWarning>
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
              <Footer />
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
