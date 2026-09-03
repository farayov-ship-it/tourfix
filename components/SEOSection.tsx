import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

interface SEOSectionProps {
  locale: Locale;
}

export default function SEOSection({ locale }: SEOSectionProps) {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <article className="prose prose-invert prose-sand max-w-none">
          <h2 className="font-display text-3xl font-light text-sand-50">{t(locale, "seo.title")}</h2>
          <p className="mt-4 text-sand-400 leading-relaxed">{t(locale, "seo.p1")}</p>
          <h3 className="mt-8 font-display text-xl text-sand-200">{t(locale, "seo.h2.1")}</h3>
          <p className="mt-3 text-sand-400 leading-relaxed">{t(locale, "seo.p2")}</p>
          <h3 className="mt-8 font-display text-xl text-sand-200">{t(locale, "seo.h2.2")}</h3>
          <p className="mt-3 text-sand-400 leading-relaxed">{t(locale, "seo.p3")}</p>
          <h3 className="mt-8 font-display text-xl text-sand-200">{t(locale, "seo.h2.3")}</h3>
          <p className="mt-3 text-sand-400 leading-relaxed">{t(locale, "seo.p4")}</p>
        </article>
      </div>
    </section>
  );
}
