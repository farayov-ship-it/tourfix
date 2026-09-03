"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import OptImage from "./OptImage";
import { t } from "@/lib/translations";
import { guides as fallbackGuides, contact as fallbackContact } from "@/lib/data";
import { getWhatsAppLink, getTelegramLink } from "@/lib/messaging";
import { images } from "@/lib/images";
import type { Locale } from "@/lib/i18n";

type GuideItem = {
  id: string;
  name: string;
  city: string;
  languages: string[];
  rating: number;
  reviews: number;
  pricePerDay: number;
  specialty: string;
  image?: string;
};

interface GuidesSectionProps {
  locale: Locale;
  limit?: number;
  items?: GuideItem[];
  contact?: { whatsapp: string; telegram: string };
}

export default function GuidesSection({
  locale,
  limit,
  items,
  contact,
}: GuidesSectionProps) {
  const displayed = items?.length
    ? items
    : (limit ? fallbackGuides.slice(0, limit) : fallbackGuides).map((g) => ({
        ...g,
        image: images.guides[g.id as keyof typeof images.guides],
      }));
  const prefix = `/${locale}`;
  const wa = contact?.whatsapp || fallbackContact.whatsapp;
  const tg = contact?.telegram || fallbackContact.telegram;

  return (
    <section className="bg-sand-950/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
              {t(locale, "guides.title")}
            </h2>
            <p className="mt-4 text-sand-400">{t(locale, "guides.subtitle")}</p>
          </div>
          {(limit || items) && (
            <Link
              href={`${prefix}/guides`}
              className="rounded-full glass px-6 py-3 text-sm font-medium text-gold-400 hover:bg-white/10"
            >
              {t(locale, "guides.viewAll")}
            </Link>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((guide, i) => {
            const avatar =
              guide.image || images.guides[guide.id as keyof typeof images.guides];
            const msg = `Hi! I'd like to book guide ${guide.name} in ${guide.city}.`;
            const href = tg
              ? getTelegramLink(tg, msg)
              : getWhatsAppLink(wa, msg);
            return (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-glow group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-sand-900">
                  <OptImage
                    src={avatar}
                    alt={guide.name}
                    fill
                    zoom
                    imgClassName="object-cover object-[center_18%]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-sand-950/80 to-transparent" />
                  <div className="photo-chip absolute bottom-3 right-3 z-[2] flex items-center gap-1 rounded-full px-2.5 py-1 text-sm backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                    <span>{guide.rating}</span>
                    <span className="opacity-70">({guide.reviews})</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-sand-100">{guide.name}</h3>
                  <p className="mt-1 text-sm text-gold-400">{guide.city}</p>
                  <p className="mt-2 text-sm text-sand-400">{guide.specialty}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {guide.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-sand-400"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display text-2xl text-gold-400">
                      ${guide.pricePerDay}
                      <span className="text-sm font-normal text-sand-500">
                        {t(locale, "guides.perDay")}
                      </span>
                    </span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-sand-200 transition hover:bg-gold-500 hover:text-ink"
                    >
                      {t(locale, "routes.book")}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
