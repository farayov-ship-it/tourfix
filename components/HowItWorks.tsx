"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n-client";
import type { Locale } from "@/lib/i18n";

interface HowItWorksProps {
  locale: Locale;
}

const steps = [
  { num: "01", titleKey: "how.step1.title", descKey: "how.step1.desc" },
  { num: "02", titleKey: "how.step2.title", descKey: "how.step2.desc" },
  { num: "03", titleKey: "how.step3.title", descKey: "how.step3.desc" },
];

export default function HowItWorks({ locale }: HowItWorksProps) {
  const t = useT(locale);

  return (
    <section className="band-navy bg-gradient-to-b from-transparent via-sand-900/30 to-transparent py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center font-display text-4xl font-light text-sand-50 sm:text-5xl">
          {t("how.title")}
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-sand-400">{t("how.subtitle")}</p>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="glass mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl font-display text-2xl font-light text-gold-400">
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-[60%] top-10 hidden h-px w-[80%] bg-gradient-to-r from-gold-500/30 to-transparent md:block" />
              )}
              <h3 className="font-display text-xl text-sand-100">{t(step.titleKey)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand-400">{t(step.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
