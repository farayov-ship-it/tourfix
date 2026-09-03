"use client";

import Link from "next/link";
import { Car, Users, Map, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import OptImage from "./OptImage";
import { t } from "@/lib/translations";
import { images } from "@/lib/images";
import type { Locale } from "@/lib/i18n";

interface ServicesProps {
  locale: Locale;
}

const services = [
  {
    key: "transfers" as const,
    icon: Car,
    href: "transfers",
    badge: "services.transfers.badge",
    image: images.services.transfers,
  },
  {
    key: "guides" as const,
    icon: Users,
    href: "guides",
    badge: null,
    image: images.services.guides,
  },
  {
    key: "dayTrips" as const,
    icon: Map,
    href: "day-trips",
    badge: "services.dayTrips.badge",
    image: images.services.dayTrips,
  },
];

export default function Services({ locale }: ServicesProps) {
  const prefix = `/${locale}`;

  return (
    <section className="services-section py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
            {t(locale, "services.title")}
          </h2>
          <p className="mt-4 text-sand-400">{t(locale, "services.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`${prefix}/${service.href}`}
                className="service-card card-glow group relative block overflow-hidden rounded-2xl border border-white/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <OptImage
                    src={service.image}
                    alt={t(locale, `services.${service.key}.title`)}
                    fill
                    zoom
                    imgClassName="brightness-110"
                  />
                  <div className="service-card-fade absolute inset-0 bg-gradient-to-t from-sand-950 via-sand-950/30 to-transparent" />
                  {service.badge && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                      {t(locale, service.badge)}
                    </span>
                  )}
                  <div className="service-card-icon absolute bottom-3 left-3 inline-flex rounded-xl bg-gold-500 p-2.5 text-ink shadow-md">
                    <service.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="service-card-body bg-sand-900 p-6">
                  <h3 className="font-display text-2xl text-sand-50">
                    {t(locale, `services.${service.key}.title`)}
                  </h3>
                  <p className="service-card-desc mt-2 text-sm leading-relaxed text-sand-400">
                    {t(locale, `services.${service.key}.desc`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-500 transition-all group-hover:gap-2">
                    {t(locale, `services.${service.key}.cta`)}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
