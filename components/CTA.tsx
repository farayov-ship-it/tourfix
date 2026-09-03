"use client";

import { useBooking } from "./BookingContext";
import OptImage from "./OptImage";
import { useT } from "@/lib/i18n-client";
import { getWhatsAppLink, getTelegramLink } from "@/lib/messaging";
import { images } from "@/lib/images";
import type { Locale } from "@/lib/i18n";

interface CTAProps {
  locale: Locale;
  contact?: { whatsapp: string; telegram: string };
  ctaImage?: string;
}

export default function CTA({ locale, contact, ctaImage }: CTAProps) {
  const t = useT(locale);
  const { openBooking } = useBooking();
  const wa = contact?.whatsapp || "";
  const tg = contact?.telegram || "";

  return (
    <section className="band-navy py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0">
            <OptImage
              src={ctaImage || images.cta}
              alt=""
              fill
              imgClassName="object-cover scale-105 brightness-90"
            />
            <div className="absolute inset-0 bg-sand-950/60" />
            <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 via-transparent to-teal-600/10" />
          </div>
          <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
            <h2 className="font-display text-4xl font-light text-sand-50 sm:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sand-300">{t("cta.subtitle")}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openBooking()}
                className="btn-shimmer rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 font-semibold text-ink transition hover:from-gold-400 hover:to-gold-500 hover:shadow-lg hover:shadow-gold-500/30"
              >
                {t("cta.book")}
              </button>
              {wa && (
                <a
                  href={getWhatsAppLink(wa, "Hello! I'd like to leave a request.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full glass px-8 py-4 font-semibold text-sand-100 transition hover:bg-white/10"
                >
                  {t("cta.whatsapp")}
                </a>
              )}
              {tg && (
                <a
                  href={getTelegramLink(tg, "Hello! I'd like to leave a request.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full glass px-8 py-4 font-semibold text-sand-100 transition hover:bg-white/10"
                >
                  {t("cta.telegram")}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
