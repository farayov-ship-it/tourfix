import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { BookingProvider } from "@/components/BookingContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import GoldCursor from "@/components/GoldCursor";
import SiteAtmosphere from "@/components/SiteAtmosphere";
import ScrollProgress from "@/components/ScrollProgress";
import { TranslationProvider } from "@/lib/i18n-client";
import { buildLocaleDict } from "@/lib/build-dict";
import { getEnabledLocales, getCities, getSiteSettings } from "@/lib/db/queries";
import { pickLocale } from "@/lib/locale-map";
import { fallbackLocaleCodes } from "@/lib/i18n";

export async function generateStaticParams() {
  try {
    const locales = await getEnabledLocales();
    if (locales.length) return locales.map((l) => ({ locale: l.code }));
  } catch {
    /* build without DB */
  }
  return fallbackLocaleCodes.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [dict, enabledLocales, cities, settings] = await Promise.all([
    buildLocaleDict(locale),
    getEnabledLocales().catch(() => []),
    getCities().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const localeOptions =
    enabledLocales.length > 0
      ? enabledLocales.map((l) => ({
          code: l.code,
          name: l.nativeName || l.name,
          flag: l.flag,
          dir: l.dir,
        }))
      : fallbackLocaleCodes.map((code) => ({
          code,
          name: code,
          flag: "",
          dir: code === "ar" ? "rtl" : "ltr",
        }));

  const cityOptions = cities.map((c) => ({
    slug: c.slug,
    name: pickLocale(c.name, locale) || c.slug,
  }));

  const contact = {
    whatsapp: settings?.whatsapp ?? "",
    telegram: settings?.telegram ?? "",
  };

  return (
    <ThemeProvider>
      <TranslationProvider dict={dict}>
        <BookingProvider>
          <div lang={locale} dir={localeOptions.find((l) => l.code === locale)?.dir || "ltr"}>
            <SiteAtmosphere />
            <GoldCursor />
            <ScrollProgress />
            <div className="relative z-10">
              <Navbar locale={locale} locales={localeOptions} />
              <main>{children}</main>
              <Footer locale={locale} contact={contact} />
            </div>
            <BookingModal locale={locale} cities={cityOptions} contact={contact} />
          </div>
        </BookingProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}
