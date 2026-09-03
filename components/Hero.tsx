"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Star, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import HeroBackground from "./three/HeroBackground";
import OptImage from "./OptImage";
import CountUp from "./CountUp";
import { useBooking } from "./BookingContext";
import { t } from "@/lib/translations";
import { stats as fallbackStats } from "@/lib/data";
import { images } from "@/lib/images";
import type { Locale } from "@/lib/i18n";
import { BrandOrnament } from "./BrandLogo";

interface HeroProps {
  locale: Locale;
  stats?: { routes: number; vehicles: number; rating: number; guides?: number };
}

export default function Hero({ locale, stats = fallbackStats }: HeroProps) {
  const { openBooking } = useBooking();
  const prefix = `/${locale}`;
  const collageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = collageRef.current;
    if (!root || window.matchMedia("(pointer: coarse)").matches) return;

    const cards = root.querySelectorAll<HTMLElement>("[data-parallax]");
    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cards.forEach((card) => {
        const depth = Number(card.dataset.parallax) || 1;
        card.style.transform = `translate3d(${x * 18 * depth}px, ${y * 12 * depth}px, 0)`;
      });
    };
    const onLeave = () => {
      cards.forEach((card) => {
        card.style.transform = "translate3d(0,0,0)";
      });
    };
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="site-hero relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <OptImage
          src={images.hero.main}
          alt=""
          fill
          priority
          imgClassName="object-cover opacity-[0.52] brightness-105 saturate-125"
        />
        <div className="hero-scrim hero-scrim-x absolute inset-0 bg-gradient-to-r from-sand-950 via-sand-950/70 to-sand-950/25" />
        <div className="hero-scrim hero-scrim-y absolute inset-0 bg-gradient-to-t from-sand-950 via-transparent to-sand-950/35" />
      </div>

      <HeroBackground />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 animate-pulse-soft text-gold-400" />
            <span className="text-sand-300">{t(locale, "hero.badge")}</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />
              ))}
            </div>
          </div>

          <h1 className="font-display text-5xl font-light leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-sand-100">{t(locale, "hero.title1")}</span>
            <br />
            <span className="text-gradient">{t(locale, "hero.title2")}</span>
            <br />
            <span className="text-sand-200">{t(locale, "hero.title3")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-400">
            {t(locale, "hero.subtitle")}
          </p>
          <BrandOrnament className="justify-start" />

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => openBooking()}
              className="btn-shimmer group flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 font-semibold text-ink transition hover:from-gold-400 hover:to-gold-500 hover:shadow-lg hover:shadow-gold-500/25"
            >
              {t(locale, "hero.cta.transfer")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <Link
              href={`${prefix}/guides`}
              className="flex items-center gap-2 rounded-full glass px-8 py-4 font-semibold text-sand-100 transition hover:bg-white/10"
            >
              {t(locale, "hero.cta.guide")}
            </Link>
          </div>

          <div className="relative mt-10 h-52 overflow-hidden rounded-2xl border border-white/15 md:hidden">
            <OptImage
              src={images.hero.main}
              alt="Uzbekistan"
              fill
              priority
              imgClassName="brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sand-950/70 to-transparent" />
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center sm:text-left">
              <div className="font-display text-3xl font-semibold text-gold-400">
                <CountUp to={stats.routes} suffix="+" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-sand-500">
                {t(locale, "hero.stat.routes")}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="font-display text-3xl font-semibold text-gold-400">
                <CountUp to={stats.vehicles} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-sand-500">
                {t(locale, "hero.stat.vehicles")}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="font-display text-3xl font-semibold text-gold-400">
                <CountUp to={stats.rating} decimals={1} suffix=" ★" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-sand-500">
                {t(locale, "hero.stat.rating")}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="font-display text-3xl font-semibold text-gold-400">✓</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-sand-500">
                {t(locale, "hero.stat.verified")}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={collageRef}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mt-4 hidden h-[520px] md:block lg:mt-0 lg:h-[560px]"
        >
          <div
            data-parallax="1.1"
            className="absolute right-0 top-0 h-[400px] w-[280px] overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/40 transition-transform duration-300 ease-out will-change-transform lg:h-[420px] lg:w-[300px]"
          >
            <OptImage
              src={images.hero.main}
              alt="Samarqand Registon"
              fill
              priority
              imgClassName="brightness-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sand-950/50 to-transparent" />
          </div>
          <div
            data-parallax="0.7"
            className="absolute bottom-8 left-0 h-[240px] w-[200px] overflow-hidden rounded-2xl border border-white/15 shadow-xl transition-transform duration-300 ease-out will-change-transform lg:h-[260px] lg:w-[220px]"
          >
            <OptImage
              src={images.hero.secondary}
              alt="Xiva Ichon-Qala"
              fill
              imgClassName="object-cover brightness-110"
            />
          </div>
          <div
            data-parallax="1.4"
            className="absolute bottom-24 right-10 h-[150px] w-[130px] overflow-hidden rounded-2xl border border-gold-500/40 shadow-lg glow-gold transition-transform duration-300 ease-out will-change-transform lg:right-16 lg:h-[160px] lg:w-[140px]"
          >
            <OptImage
              src={images.hero.accent}
              alt="Buxoro Po-i-Kalon"
              fill
              imgClassName="object-cover brightness-110"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
