"use client";

import { createContext, useContext } from "react";
import { t as tFallback } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

const DictContext = createContext<Record<string, string>>({});

export function TranslationProvider({
  dict,
  children,
}: {
  dict: Record<string, string>;
  children: React.ReactNode;
}) {
  return <DictContext.Provider value={dict}>{children}</DictContext.Provider>;
}

export function useT(locale: Locale) {
  const dict = useContext(DictContext);
  return (key: string) => dict[key] || tFallback(locale, key);
}
