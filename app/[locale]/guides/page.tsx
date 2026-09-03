import { notFound } from "next/navigation";
import GuidesSection from "@/components/GuidesSection";
import CTA from "@/components/CTA";
import { t } from "@/lib/translations";
import { isValidLocale, type Locale } from "@/lib/i18n";
import {
  getPublishedGuides,
  getSiteSettings,
  pickLocale,
} from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: `${t(locale as Locale, "page.guides.title")} | TourFix` };
}

export default async function GuidesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [settings, guides] = await Promise.all([
    getSiteSettings(),
    getPublishedGuides(),
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
            {t(locale, "page.guides.title")}
          </h1>
          <p className="mt-4 text-sand-400">{t(locale, "page.guides.subtitle")}</p>
        </div>
      </section>
      <GuidesSection
        locale={locale}
        contact={contact}
        items={guides.map((g) => ({
          id: g.slug,
          name: g.name,
          city: g.city,
          languages: JSON.parse(g.languages || "[]") as string[],
          rating: g.rating,
          reviews: g.reviewsCount,
          pricePerDay: g.pricePerDay,
          specialty: pickLocale(g.specialty, locale),
          image: g.image?.url,
        }))}
      />
      <CTA locale={locale} contact={contact} />
    </>
  );
}
