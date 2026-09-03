"use client";

import Link from "next/link";
import { Clock, Check } from "lucide-react";
import { motion } from "framer-motion";
import OptImage from "./OptImage";
import { t, formatFromPrice } from "@/lib/translations";
import { dayTrips as fallbackTrips, contact as fallbackContact } from "@/lib/data";
import { getWhatsAppLink, getTelegramLink } from "@/lib/messaging";
import { images } from "@/lib/images";
import type { Locale } from "@/lib/i18n";

type TripItem = {
  id: string;
  title: string;
  city: string;
  duration: string;
  price: number;
  highlights: string[];
  image?: string;
};

interface DayTripsSectionProps {
  locale: Locale;
  limit?: number;
  items?: TripItem[];
  contact?: { whatsapp: string; telegram: string };
}

export default function DayTripsSection({
  locale,
  limit,
  items,
  contact,
}: DayTripsSectionProps) {
  const displayed: TripItem[] = items?.length
    ? items
    : (limit ? fallbackTrips.slice(0, limit) : fallbackTrips).map((trip) => ({
        id: trip.id,
        title: trip.title[locale as "en" | "ru" | "uz"] || trip.title.en,
        city: trip.city,
        duration: trip.duration,
        price: trip.price,
        highlights:
          trip.highlights[locale as "en" | "ru" | "uz"] || trip.highlights.en,
        image: images.dayTrips[trip.id as keyof typeof images.dayTrips],
      }));
  const prefix = `/${locale}`;
  const wa = contact?.whatsapp || fallbackContact.whatsapp;
  const tg = contact?.telegram || fallbackContact.telegram;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
              {t(locale, "dayTrips.title")}
            </h2>
            <p className="mt-4 text-sand-400">{t(locale, "dayTrips.subtitle")}</p>
          </div>
          {(limit || items) && (
            <Link
              href={`${prefix}/day-trips`}
              className="rounded-full glass px-6 py-3 text-sm font-medium text-gold-400 hover:bg-white/10"
            >
              {t(locale, "dayTrips.viewAll")}
            </Link>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayed.map((trip, i) => {
            const img =
              trip.image ||
              images.dayTrips[trip.id as keyof typeof images.dayTrips];
            const msg = `Hi! I'm interested in: ${trip.title}`;
            const href = tg ? getTelegramLink(tg, msg) : getWhatsAppLink(wa, msg);
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glow group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative h-48 overflow-hidden">
                  <OptImage
                    src={img}
                    alt={trip.title}
                    fill
                    zoom
                    imgClassName="brightness-110"
                  />
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-sand-950/70 via-transparent to-transparent" />
                  <div className="photo-chip absolute bottom-3 left-3 z-[2] flex items-center gap-2 rounded-full px-3 py-1 text-xs backdrop-blur">
                    <Clock className="h-3.5 w-3.5 text-gold-400" /> {trip.duration}
                    <span className="opacity-70">•</span>
                    <span>{trip.city}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl text-sand-50">{trip.title}</h3>
                  <ul className="mt-4 flex-1 space-y-2">
                    {trip.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-sand-400">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-display text-2xl text-gold-400">
                      {formatFromPrice(locale, trip.price)}
                    </span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gold-500/20 px-4 py-2 text-sm font-medium text-gold-400 transition hover:bg-gold-500 hover:text-ink"
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
