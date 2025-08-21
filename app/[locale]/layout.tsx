import type React from "react";
import { notFound } from "next/navigation";
import { dictionaries } from "@/dictionaries";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the locale exists in our dictionaries
  if (!Object.prototype.hasOwnProperty.call(dictionaries, locale)) {
    notFound();
  }

  return children;
}
