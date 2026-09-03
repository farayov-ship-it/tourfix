"use client";

import { useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "@/lib/translations";
import { reviews as fallbackReviews } from "@/lib/data";
import type { Locale } from "@/lib/i18n";

type ReviewItem = {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: string;
  date: string;
};

interface ReviewsSectionProps {
  locale: Locale;
  items?: ReviewItem[];
}

export default function ReviewsSection({ locale, items }: ReviewsSectionProps) {
  const list: ReviewItem[] =
    items?.length
      ? items
      : fallbackReviews.map((r) => ({
          id: r.id,
          name: r.name,
          country: r.country,
          rating: r.rating,
          text: r.text[locale as "en" | "ru" | "uz"] || r.text.en,
          date: r.date,
        }));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const review = list[index] ?? list[0];

  useEffect(() => {
    if (paused || list.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 5200);
    return () => clearInterval(id);
  }, [paused, list.length]);

  if (!review) return null;

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  return (
    <section className="band-navy bg-gradient-to-b from-transparent via-sand-900/20 to-transparent py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
            {t(locale, "reviews.title")}
          </h2>
          <p className="mt-4 text-sand-400">{t(locale, "reviews.subtitle")}</p>
        </div>

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl glass p-8 md:p-10"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-gold-500/15" />
              <div className="mb-5 flex gap-1">
                {[...Array(review.rating)].map((_, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, scale: 0.4, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.12 + j * 0.08, type: "spring", stiffness: 320 }}
                  >
                    <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
                  </motion.span>
                ))}
              </div>
              <p className="text-base leading-relaxed text-sand-200 md:text-lg">{review.text}</p>
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-medium text-sand-50">{review.name}</p>
                <p className="text-sm text-sand-500">{review.country}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {list.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                className="rounded-full border border-white/10 p-2 text-sand-300 transition hover:border-gold-500/40 hover:text-gold-400"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {list.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-gold-500" : "w-2 bg-sand-600"
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="rounded-full border border-white/10 p-2 text-sand-300 transition hover:border-gold-500/40 hover:text-gold-400"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
