"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPinned, Sparkles } from "lucide-react";
import Link from "next/link";
import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";
import { BrandOrnament } from "./BrandLogo";

type StopMeta = {
  hint: Record<string, string>;
  kmToNext?: number;
  hoursToNext?: string;
};

const defaultStops: Record<string, string[]> = {
  en: ["Tashkent", "Samarkand", "Bukhara", "Khiva"],
  ru: ["Ташкент", "Самарканд", "Бухара", "Хива"],
  uz: ["Toshkent", "Samarqand", "Buxoro", "Xiva"],
};

/** Meta keyed by English canonical order index */
const stopMeta: StopMeta[] = [
  {
    hint: {
      en: "Gateway capital",
      ru: "Столица-ворота",
      uz: "Poytaxt darvozasi",
    },
    kmToNext: 315,
    hoursToNext: "4.5–5h",
  },
  {
    hint: {
      en: "Registan & heart of the Road",
      ru: "Регистан — сердце пути",
      uz: "Registon — yo‘l yuragi",
    },
    kmToNext: 270,
    hoursToNext: "4h",
  },
  {
    hint: {
      en: "Domes & old towns",
      ru: "Купола и старый город",
      uz: "Gumbazlar va eski shahar",
    },
    kmToNext: 450,
    hoursToNext: "6–7h",
  },
  {
    hint: {
      en: "Ichon-Qala finale",
      ru: "Финал — Ичан-Кала",
      uz: "Final — Ichon-Qal’a",
    },
  },
];

/** Animated Silk Road path: Tashkent → … → Khiva */
export default function SilkRoutePath({
  locale,
  stops: stopsProp,
}: {
  locale: Locale;
  stops?: string[];
}) {
  const stops = stopsProp?.length ? stopsProp : defaultStops[locale] || defaultStops.en;
  const prefix = `/${locale}`;
  const totalKm = stopMeta.reduce((s, m) => s + (m.kmToNext || 0), 0);

  return (
    <section className="band-navy relative overflow-hidden py-14 md:py-20">
      {/* Soft ambiance */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-14"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gold-500">
            <Sparkles className="h-3 w-3" />
            {t(locale, "silkRoute.label")}
          </div>
          <h2 className="font-display text-2xl font-light text-sand-50 sm:text-3xl md:text-4xl">
            {t(locale, "silkRoute.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-sand-400 md:text-base">
            {t(locale, "silkRoute.subtitle")}
          </p>
          <BrandOrnament />
          <p className="mt-4 text-xs tracking-wide text-sand-500">
            ~{totalKm} km · {stops.length} {t(locale, "silkRoute.cities")}
          </p>
        </motion.div>

        <div className="relative rounded-3xl border border-white/10 bg-sand-900/30 px-3 py-10 shadow-[0_0_60px_rgba(212,168,83,0.06)] backdrop-blur-sm sm:px-6 md:px-10 md:py-12">
          {/* Decorative corners */}
          <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-gold-500/35 md:left-5 md:top-5" />
          <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t border-gold-500/35 md:right-5 md:top-5" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l border-gold-500/35 md:bottom-5 md:left-5" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b border-r border-gold-500/35 md:bottom-5 md:right-5" />

          <div className="relative px-1 py-6 sm:px-2 sm:py-8">
            {/* Row: step numbers */}
            <div
              className="mb-2 grid gap-3"
              style={{ gridTemplateColumns: `repeat(${Math.max(stops.length, 1)}, minmax(0, 1fr))` }}
            >
              {stops.map((city, i) => (
                <div key={`n-${city}-${i}`} className="text-center font-display text-[10px] text-gold-500/70 md:text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </div>
              ))}
            </div>

            {/* Row: line + markers (line vertically centered on dots) */}
            <div className="relative px-4 sm:px-6">
              <div
                className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-sand-600/50 sm:left-6 sm:right-6"
                aria-hidden
              />
              <motion.div
                className="absolute left-4 top-1/2 h-[2px] origin-left -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 sm:left-6"
                style={{ width: "calc(100% - 2rem)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="pointer-events-none absolute top-1/2 z-10 h-10 w-20 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-gold-400/45 to-transparent blur-md"
                initial={{ left: "0%", opacity: 0 }}
                whileInView={{
                  left: ["4%", "86%"],
                  opacity: [0, 1, 1, 0],
                }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1.4,
                }}
              />
              <motion.div
                className="absolute top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/60 bg-sand-950 shadow-[0_0_18px_var(--gold-400)]"
                initial={{ left: "0.25rem" }}
                whileInView={{ left: "calc(100% - 2rem)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                <MapPinned className="h-3.5 w-3.5 text-gold-400" />
              </motion.div>

              <div
                className="relative z-[1] grid items-center gap-3"
                style={{ gridTemplateColumns: `repeat(${Math.max(stops.length, 1)}, minmax(0, 1fr))` }}
              >
                {stops.map((city, i) => {
                  const isLast = i === stops.length - 1;
                  return (
                    <motion.div
                      key={`m-${city}-${i}`}
                      className="flex justify-center"
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.18, duration: 0.4 }}
                    >
                      <div className="relative flex h-10 w-10 items-center justify-center md:h-11 md:w-11">
                        <span
                          className={`absolute inset-0 rounded-full ${
                            isLast
                              ? "bg-gold-500/20 shadow-[0_0_22px_color-mix(in_srgb,var(--gold-500)_55%,transparent)]"
                              : "bg-gold-500/10"
                          }`}
                        />
                        <span
                          className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            isLast
                              ? "border-gold-400 bg-gold-500"
                              : "border-gold-500 bg-sand-950"
                          }`}
                        >
                          {!isLast && (
                            <span className="h-1.5 w-1.5 rounded-full bg-gold-400/80" />
                          )}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Row: labels */}
            <div
              className="mt-4 grid gap-3 md:mt-5"
              style={{ gridTemplateColumns: `repeat(${Math.max(stops.length, 1)}, minmax(0, 1fr))` }}
            >
              {stops.map((city, i) => {
                const meta = stopMeta[i] || stopMeta[stopMeta.length - 1];
                const hint = meta?.hint[locale] || meta?.hint.en || "";
                const isLast = i === stops.length - 1;

                return (
                  <motion.div
                    key={`l-${city}-${i}`}
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.28 + i * 0.18, duration: 0.4 }}
                  >
                    <p className="font-display text-base text-sand-50 sm:text-lg md:text-xl">
                      {city}
                    </p>
                    {hint && (
                      <p className="mt-1 max-w-[9.5rem] text-[10px] leading-snug text-sand-500 sm:text-[11px] md:max-w-[11rem]">
                        {hint}
                      </p>
                    )}
                    {!isLast && meta?.kmToNext && (
                      <div className="mt-3 hidden flex-col items-center gap-0.5 sm:flex">
                        <span className="text-[10px] uppercase tracking-wider text-gold-500/70">
                          {meta.kmToNext} km
                        </span>
                        <span className="text-[10px] text-sand-600">{meta.hoursToNext}</span>
                        <ArrowRight className="mt-0.5 h-3 w-3 text-gold-500/40" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-2 flex flex-wrap items-center justify-center gap-3 border-t border-white/5 pt-6 text-center"
          >
            <p className="text-xs text-sand-500 sm:text-sm">{t(locale, "silkRoute.ctaHint")}</p>
            <Link
              href={`${prefix}/transfers`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-medium text-gold-400 transition hover:bg-gold-500/20"
            >
              {t(locale, "silkRoute.cta")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
