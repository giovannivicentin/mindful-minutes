"use client";

import type React from "react";

import { createContext, useContext } from "react";

type I18nContextType = {
  locale: string;
};

const I18nContext = createContext<I18nContextType>({ locale: "en" });

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <I18nContext.Provider value={{ locale }}>{children}</I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
