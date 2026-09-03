"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

interface FAQProps {
  locale: Locale;
  items?: Array<{ q: string; a: string }>;
}

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
];

export default function FAQ({ locale, items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);
  const list =
    items?.length
      ? items
      : faqKeys.map((item) => ({ q: t(locale, item.q), a: t(locale, item.a) }));

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center font-display text-4xl font-light text-sand-50 sm:text-5xl">
          {t(locale, "faq.title")}
        </h2>

        <div className="space-y-3">
          {list.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl glass">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-sand-100">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-sand-400 transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="border-t border-white/5 px-6 pb-5 pt-3 text-sm leading-relaxed text-sand-400">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
