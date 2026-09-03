"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n-client";
import { localeFlags, localeNames, type Locale } from "@/lib/i18n";
import { useBooking } from "./BookingContext";
import ThemeSwitcher from "./ThemeSwitcher";
import BrandLogo from "./BrandLogo";

interface NavbarProps {
  locale: Locale;
  locales: Array<{ code: string; name: string; flag: string; dir: string }>;
}

const navLinks = [
  { key: "nav.transfers", href: "transfers" },
  { key: "nav.guides", href: "guides" },
  { key: "nav.dayTrips", href: "day-trips" },
  { key: "nav.reviews", href: "reviews" },
  { key: "nav.blog", href: "blog" },
];

export default function Navbar({ locale, locales }: NavbarProps) {
  const t = useT(locale);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const prefix = `/${locale}`;
  const restPath = pathname?.replace(new RegExp(`^/${locale}`), "") || "";
  const isHome = restPath === "" || restPath === "/";
  const navSolid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        navSolid ? "glass-strong py-3 shadow-lg shadow-black/20" : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={prefix} className="group">
          <BrandLogo variant="full" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`${prefix}/${link.href}`}
              className="rounded-lg px-4 py-2 text-sm text-sand-300 transition hover:bg-white/5 hover:text-sand-50"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeSwitcher locale={locale} />

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-sand-300 transition hover:bg-white/5"
              aria-label="Change language"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">
                {locales.find((l) => l.code === locale)?.flag || localeFlags[locale]}
              </span>
              <span className="uppercase">{locale}</span>
              <ChevronDown className={cn("h-3 w-3 transition", langOpen && "rotate-180")} />
            </button>
            {langOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
            )}
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="nav-menu absolute right-0 top-full z-50 mt-1 max-h-80 min-w-[160px] overflow-y-auto rounded-xl glass-strong py-1 shadow-xl origin-top-right"
                >
                  {locales.map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}${restPath}`}
                      onClick={() => setLangOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm transition hover:bg-white/10",
                        l.code === locale ? "text-gold-400" : "text-sand-300"
                      )}
                    >
                      <span>{l.flag || localeFlags[l.code]}</span>
                      <span>{l.name || localeNames[l.code] || l.code}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => openBooking()}
            className="btn-shimmer hidden rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-semibold text-ink transition hover:from-gold-400 hover:to-gold-500 sm:block"
          >
            {t("nav.book")}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-sand-300 hover:bg-white/5 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-menu glass-strong border-t border-white/10 lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`${prefix}/${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sand-200 hover:bg-white/5"
              >
                {t(link.key)}
              </Link>
            ))}
            <button
              onClick={() => {
                openBooking();
                setMobileOpen(false);
              }}
              className="btn-shimmer mt-2 rounded-full bg-gold-500 px-4 py-3 font-semibold text-ink"
            >
              {t("nav.book")}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
