import type React from "react";
import { notFound } from "next/navigation";
import { dictionaries } from "@/dictionaries";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the locale exists in our dictionaries
  if (!Object.keys(dictionaries).includes(params.locale)) {
    notFound();
  }

  // Just return the children without wrapping in html/body tags
  // The root layout will handle the HTML structure
  return children;
}
