"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import OptImage from "./OptImage";
import { t, formatFromPrice } from "@/lib/translations";
import { vehicles as fallbackVehicles } from "@/lib/data";
import { vehicleImage } from "@/lib/images";
import type { Locale } from "@/lib/i18n";

type VehicleItem = {
  id: string;
  name: string;
  category: string;
  capacity: number;
  priceFrom: number;
  image?: string;
};

interface VehiclesProps {
  locale: Locale;
  items?: VehicleItem[];
}

export default function Vehicles({ locale, items }: VehiclesProps) {
  const displayed = items?.length
    ? items
    : fallbackVehicles.slice(0, 6).map((v) => ({ ...v, image: undefined as string | undefined }));
  const prefix = `/${locale}`;

  return (
    <section className="py-24 bg-sand-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
              {t(locale, "vehicles.title")}
            </h2>
            <p className="mt-4 max-w-xl text-sand-400">{t(locale, "vehicles.subtitle")}</p>
          </div>
          <Link
            href={`${prefix}/transfers`}
            className="rounded-full glass px-6 py-3 text-sm font-medium text-gold-400 transition hover:bg-white/10"
          >
            {t(locale, "vehicles.viewAll")}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-glow group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative h-40 overflow-hidden bg-sand-900">
                <OptImage
                  src={vehicle.image || vehicleImage(vehicle.id, vehicle.category)}
                  alt={vehicle.name}
                  fill
                  zoom
                  imgClassName="object-cover object-center brightness-105"
                />
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-sand-950/50 via-transparent to-transparent" />
                <span className="photo-chip absolute right-3 top-3 z-[2] rounded-full px-3 py-1 text-xs backdrop-blur">
                  {t(locale, `category.${vehicle.category}`)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-sand-100">{vehicle.name}</h3>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-sand-500">
                    {vehicle.capacity} {t(locale, "vehicles.seats")}
                  </span>
                  <span className="font-semibold text-gold-400">
                    {formatFromPrice(locale, vehicle.priceFrom)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
