import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Vehicles from "@/components/Vehicles";
import Destinations from "@/components/Destinations";
import HowItWorks from "@/components/HowItWorks";
import Routes from "@/components/Routes";
import GuidesSection from "@/components/GuidesSection";
import DayTripsSection from "@/components/DayTripsSection";
import ReviewsSection from "@/components/ReviewsSection";
import SEOSection from "@/components/SEOSection";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import ScrollReveal from "@/components/ScrollReveal";
import SilkRoutePath from "@/components/SilkRoutePath";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import {
  getPublishedRoutes,
  getPublishedVehicles,
  getPublishedGuides,
  getPublishedDayTrips,
  getPublishedReviews,
  getDestinations,
  getFaqs,
  getSiteSettings,
  pickLocale,
  parseJsonArray,
  parseLocaleStringArrays,
} from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Private Transfers & Local Guides in Uzbekistan | TourFix",
    ru: "Частные трансферы и гиды в Узбекистане | TourFix",
    uz: "O'zbekistonda shaxsiy transferlar va gidlar | TourFix",
  };
  return {
    title: isValidLocale(locale) ? titles[locale] || titles.en : titles.en,
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [settings, routes, vehicles, guides, dayTrips, reviews, destinations, faqs] =
    await Promise.all([
      getSiteSettings(),
      getPublishedRoutes(),
      getPublishedVehicles(),
      getPublishedGuides(),
      getPublishedDayTrips(),
      getPublishedReviews(),
      getDestinations(),
      getFaqs(),
    ]);

  const limits = {
    vehicles: settings?.homeVehiclesLimit ?? 6,
    guides: settings?.homeGuidesLimit ?? 3,
    dayTrips: settings?.homeDayTripsLimit ?? 3,
    routes: settings?.homeRoutesLimit ?? 6,
  };

  let stats = { routes: 240, vehicles: 21, rating: 5.0, guides: 45 };
  try {
    if (settings?.stats) stats = { ...stats, ...JSON.parse(settings.stats) };
  } catch {
    /* keep defaults */
  }

  const silkStops = parseJsonArray(settings?.silkRouteStops);
  const contact = {
    whatsapp: settings?.whatsapp || "",
    telegram: settings?.telegram || "",
  };

  const routeItems = routes.slice(0, limits.routes).map((r) => ({
    id: r.slug,
    from: r.fromName,
    to: r.toName,
    price: r.price,
    duration: r.duration,
    distance: r.distance,
    popular: r.popular,
    image: r.image?.url,
  }));

  const vehicleItems = vehicles.slice(0, limits.vehicles).map((v) => ({
    id: v.slug,
    name: v.name,
    category: v.category as
      | "economy"
      | "comfort"
      | "premium"
      | "suv"
      | "minivan"
      | "van",
    capacity: v.capacity,
    priceFrom: v.priceFrom,
    image: v.image?.url,
  }));

  const guideItems = guides.slice(0, limits.guides).map((g) => ({
    id: g.slug,
    name: g.name,
    city: g.city,
    languages: JSON.parse(g.languages || "[]") as string[],
    rating: g.rating,
    reviews: g.reviewsCount,
    pricePerDay: g.pricePerDay,
    specialty: pickLocale(g.specialty, locale),
    image: g.image?.url,
  }));

  const dayTripItems = dayTrips.slice(0, limits.dayTrips).map((d) => ({
    id: d.slug,
    title: pickLocale(d.title, locale),
    city: d.city,
    duration: d.duration,
    price: d.price,
    highlights: pickLocaleListSafe(d.highlights, locale),
    image: d.image?.url,
  }));

  const reviewItems = reviews.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    rating: r.rating,
    text: pickLocale(r.text, locale),
    date: r.date.toISOString().slice(0, 10),
  }));

  const destinationItems = destinations.map((d) => ({
    id: d.slug,
    name: pickLocale(d.name, locale),
    tagline: pickLocale(d.tagline, locale),
    image: d.image?.url || "",
  }));

  const faqItems = faqs.map((f) => ({
    q: pickLocale(f.question, locale),
    a: pickLocale(f.answer, locale),
  }));

  return (
    <>
      <Hero locale={locale} stats={stats} />
      <ScrollReveal>
        <Destinations locale={locale} items={destinationItems} />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <SilkRoutePath locale={locale} stops={silkStops.length ? silkStops : undefined} />
      </ScrollReveal>
      <ScrollReveal>
        <Services locale={locale} />
      </ScrollReveal>
      <ScrollReveal>
        <Vehicles locale={locale} items={vehicleItems} />
      </ScrollReveal>
      <ScrollReveal>
        <HowItWorks locale={locale} />
      </ScrollReveal>
      <ScrollReveal>
        <Routes locale={locale} items={routeItems} />
      </ScrollReveal>
      <ScrollReveal>
        <GuidesSection locale={locale} items={guideItems} contact={contact} />
      </ScrollReveal>
      <ScrollReveal>
        <DayTripsSection locale={locale} items={dayTripItems} contact={contact} />
      </ScrollReveal>
      <ScrollReveal>
        <ReviewsSection locale={locale} items={reviewItems} />
      </ScrollReveal>
      <ScrollReveal>
        <SEOSection locale={locale} />
      </ScrollReveal>
      <ScrollReveal>
        <FAQ locale={locale} items={faqItems} />
      </ScrollReveal>
      <ScrollReveal>
        <CTA locale={locale} contact={contact} ctaImage={settings?.ctaImage || undefined} />
      </ScrollReveal>
    </>
  );
}

function pickLocaleListSafe(raw: string, locale: string): string[] {
  const map = parseLocaleStringArrays(raw);
  if (map[locale]?.length) return map[locale];
  if (map.en?.length) return map.en;
  return Object.values(map).find((v) => v.length) ?? [];
}
