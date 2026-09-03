import { notFound } from "next/navigation";
import Routes from "@/components/Routes";
import Vehicles from "@/components/Vehicles";
import CTA from "@/components/CTA";
import { t } from "@/lib/translations";
import { isValidLocale, type Locale } from "@/lib/i18n";
import {
  getPublishedRoutes,
  getPublishedVehicles,
  getSiteSettings,
} from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: `${t(locale as Locale, "page.transfers.title")} | TourFix` };
}

export default async function TransfersPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [settings, routes, vehicles] = await Promise.all([
    getSiteSettings(),
    getPublishedRoutes(),
    getPublishedVehicles(),
  ]);

  return (
    <>
      <section className="pb-12 pt-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-light text-sand-50">
            {t(locale, "page.transfers.title")}
          </h1>
          <p className="mt-4 text-sand-400">{t(locale, "page.transfers.subtitle")}</p>
        </div>
      </section>
      <Routes
        locale={locale}
        items={routes.map((r) => ({
          id: r.slug,
          from: r.fromName,
          to: r.toName,
          price: r.price,
          duration: r.duration,
          distance: r.distance,
          popular: r.popular,
          image: r.image?.url,
        }))}
      />
      <Vehicles
        locale={locale}
        items={vehicles.map((v) => ({
          id: v.slug,
          name: v.name,
          category: v.category,
          capacity: v.capacity,
          priceFrom: v.priceFrom,
          image: v.image?.url,
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
