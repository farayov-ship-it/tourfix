"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes, useTheme, type ThemeId } from "./ThemeProvider";
import type { Locale } from "@/lib/i18n";

export default function ThemeSwitcher({ locale }: { locale: Locale }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const pick = (id: ThemeId) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-sand-300 transition hover:bg-white/5"
        aria-label="Change design"
        title="Design"
      >
        <Palette className="h-4 w-4" />
        <span
          className="hidden h-3 w-3 rounded-full border border-sand-400/40 sm:block"
          style={{ background: themes.find((t) => t.id === theme)?.swatch }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="nav-menu absolute right-0 top-full z-50 mt-1 min-w-[168px] overflow-hidden rounded-xl glass-strong py-1 shadow-xl">
            <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-sand-500">
              {locale === "uz" ? "Dizayn" : locale === "ru" ? "Дизайн" : "Design"}
            </p>
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pick(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/10",
                  t.id === theme ? "text-gold-500" : "text-sand-300"
                )}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-sand-400/30 shadow-sm"
                  style={{ background: t.swatch }}
                />
                <span className="flex-1">
                  {t.label[locale as "en" | "ru" | "uz"] || t.label.en}
                </span>
                {t.id === theme && <Check className="h-3.5 w-3.5 text-gold-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
