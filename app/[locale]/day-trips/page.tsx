import { notFound } from "next/navigation";
import DayTripsSection from "@/components/DayTripsSection";
import CTA from "@/components/CTA";
import { t } from "@/lib/translations";
import { isValidLocale, type Locale } from "@/lib/i18n";
import {
  getPublishedDayTrips,
  getSiteSettings,
  pickLocale,
  parseLocaleStringArrays,
} from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: `${t(locale as Locale, "page.dayTrips.title")} | TourFix` };
}

export default async function DayTripsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [settings, trips] = await Promise.all([
    getSiteSettings(),
    getPublishedDayTrips(),
  ]);
  const contact = {
    whatsapp: settings?.whatsapp || "",
    telegram: settings?.telegram || "",
  };

  return (
    <>
      <section className="pb-12 pt-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-light text-sand-50">
            {t(locale, "page.dayTrips.title")}
          </h1>
          <p className="mt-4 text-sand-400">{t(locale, "page.dayTrips.subtitle")}</p>
        </div>
      </section>
      <DayTripsSection
        locale={locale}
        contact={contact}
        items={trips.map((d) => {
          const map = parseLocaleStringArrays(d.highlights);
          return {
            id: d.slug,
            title: pickLocale(d.title, locale),
            city: d.city,
            duration: d.duration,
            price: d.price,
            highlights: map[locale]?.length ? map[locale] : map.en || [],
            image: d.image?.url,
          };
        })}
      />
      <CTA locale={locale} contact={contact} />
    </>
  );
}
