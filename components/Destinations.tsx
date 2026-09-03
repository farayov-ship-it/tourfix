"use client";

import { motion } from "framer-motion";
import OptImage from "./OptImage";
import { images } from "@/lib/images";
import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

type DestItem = {
  id: string;
  name: string;
  tagline: string;
  image: string;
};

interface DestinationsProps {
  locale: Locale;
  items?: DestItem[];
}

export default function Destinations({ locale, items }: DestinationsProps) {
  const list: DestItem[] =
    items?.length
      ? items
      : images.destinations.map((d) => ({
          id: d.id,
          name: d.name[locale as "en" | "ru" | "uz"] || d.name.en,
          tagline: d.tagline[locale as "en" | "ru" | "uz"] || d.tagline.en,
          image: d.image,
        }));

  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
            {t(locale, "destinations.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand-400">
            {t(locale, "destinations.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-rows-2">
          {list.map((dest, i) => {
            const tall = i === 0 || i === 3;
            return (
              <motion.article
                key={dest.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className={`card-glow group relative overflow-hidden rounded-2xl border border-white/10 bg-sand-900 ${
                  tall
                    ? "min-h-[280px] md:row-span-2 md:min-h-[420px]"
                    : "min-h-[180px] md:min-h-[200px]"
                }`}
              >
                <OptImage
                  src={dest.image}
                  alt={dest.name}
                  fill
                  zoom
                  imgClassName="brightness-110 contrast-105"
                />
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-[2] p-4 md:p-6">
                  <p className="font-display text-xl text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] md:text-2xl">
                    {dest.name}
                  </p>
                  <p className="mt-1 text-xs text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] md:text-sm">
                    {dest.tagline}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
