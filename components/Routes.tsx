"use client";

import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import OptImage from "./OptImage";
import { useBooking, routeToBooking } from "./BookingContext";
import { t } from "@/lib/translations";
import { routes as fallbackRoutes } from "@/lib/data";
import { images } from "@/lib/images";
import type { Locale } from "@/lib/i18n";

type RouteItem = {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  distance: string;
  popular?: boolean;
  image?: string;
};

interface RoutesProps {
  locale: Locale;
  limit?: number;
  items?: RouteItem[];
}

export default function Routes({ locale, limit = 6, items }: RoutesProps) {
  const { openBooking } = useBooking();
  const displayed: RouteItem[] = items?.length
    ? items
    : fallbackRoutes.slice(0, limit).map((r) => ({ ...r, image: undefined }));
  const prefix = `/${locale}`;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
            {t(locale, "routes.title")}
          </h2>
          <p className="mt-4 text-sand-400">{t(locale, "routes.subtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((route, i) => (
            <motion.div
              key={route.id}
              id={route.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="card-glow group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative h-32 overflow-hidden">
                <OptImage
                  src={
                    route.image ||
                    images.routes[route.id] ||
                    images.destinations[0].image
                  }
                  alt={`${route.from} to ${route.to}`}
                  fill
                  zoom
                  imgClassName="brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sand-950 via-sand-950/40 to-transparent" />
                {route.popular && (
                  <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-semibold text-ink">
                    {t(locale, "routes.popular")}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-medium text-sand-50">
                  {route.from} → {route.to}
                </h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-sand-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {route.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {route.distance}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl text-gold-400">${route.price}</span>
                  <button
                    type="button"
                    onClick={() =>
                      openBooking(
                        routeToBooking({
                          id: route.id,
                          from: route.from,
                          to: route.to,
                          price: route.price,
                          duration: route.duration,
                          distance: route.distance,
                          popular: route.popular,
                        })
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-full bg-white/5 px-4 py-2 text-sm text-sand-200 transition hover:bg-gold-500 hover:text-ink"
                  >
                    {t(locale, "routes.book")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href={`${prefix}/transfers`} className="text-sm text-gold-400 hover:underline">
            {t(locale, "vehicles.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
