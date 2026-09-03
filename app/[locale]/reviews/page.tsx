import { notFound } from "next/navigation";
import ReviewsSection from "@/components/ReviewsSection";
import CTA from "@/components/CTA";
import { t } from "@/lib/translations";
import { isValidLocale, type Locale } from "@/lib/i18n";
import {
  getPublishedReviews,
  getSiteSettings,
  pickLocale,
} from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: `${t(locale as Locale, "page.reviews.title")} | TourFix` };
}

export default async function ReviewsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [settings, reviews] = await Promise.all([
    getSiteSettings(),
    getPublishedReviews(),
  ]);

  return (
    <>
      <section className="pb-12 pt-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-light text-sand-50">
            {t(locale, "page.reviews.title")}
          </h1>
          <p className="mt-4 text-sand-400">{t(locale, "page.reviews.subtitle")}</p>
        </div>
      </section>
      <ReviewsSection
        locale={locale}
        items={reviews.map((r) => ({
          id: r.id,
          name: r.name,
          country: r.country,
          rating: r.rating,
          text: pickLocale(r.text, locale),
          date: r.date.toISOString().slice(0, 10),
        }))}
      />
      <CTA
        locale={locale}
        contact={{
          whatsapp: settings?.whatsapp || "",
          telegram: settings?.telegram || "",
        }}
      />
    </>
  );
}
