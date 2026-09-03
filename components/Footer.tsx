import Link from "next/link";
import { MessageCircle, Send, Mail, Instagram } from "lucide-react";
import { t } from "@/lib/translations";
import { getWhatsAppLink, getTelegramLink } from "@/lib/messaging";
import {
  getPublishedRoutes,
  getSiteSettings,
} from "@/lib/db/queries";
import type { Locale } from "@/lib/i18n";
import BrandLogo, { BRAND } from "./BrandLogo";

interface FooterProps {
  locale: Locale;
  contact?: { whatsapp: string; telegram: string };
}

export default async function Footer({ locale, contact: contactProp }: FooterProps) {
  const prefix = `/${locale}`;
  const [settings, routeRows] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPublishedRoutes(4).catch(() => []),
  ]);

  const whatsapp = contactProp?.whatsapp || settings?.whatsapp || "";
  const telegram = contactProp?.telegram || settings?.telegram || "";
  const email = settings?.email || "hello@turkuztan.uz";
  const instagram = settings?.instagram || "turkuztan_uz";
  const popularRoutes = routeRows.filter((r) => r.popular).slice(0, 4);

  return (
    <footer className="border-t border-white/10 bg-sand-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <BrandLogo variant="full" />
            </div>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-sand-400">
              {t(locale, "footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sand-200">
              Links
            </h4>
            <ul className="space-y-2 text-sm text-sand-400">
              <li>
                <Link href={`${prefix}/transfers`} className="transition hover:text-gold-400">
                  {t(locale, "nav.transfers")}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/guides`} className="transition hover:text-gold-400">
                  {t(locale, "nav.guides")}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/blog`} className="transition hover:text-gold-400">
                  {t(locale, "nav.blog")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sand-200">
              {t(locale, "routes.title")}
            </h4>
            <ul className="space-y-2 text-sm text-sand-400">
              {popularRoutes.map((r) => (
                <li key={r.id}>
                  <Link href={`${prefix}/transfers`} className="transition hover:text-gold-400">
                    {r.fromName} → {r.toName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sand-200">
              Contact
            </h4>
            <div className="flex flex-wrap gap-3">
              {whatsapp && (
                <a
                  href={getWhatsAppLink(whatsapp, "Hello TurkUztan!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full glass p-2.5 text-sand-300 transition hover:text-gold-400"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {telegram && (
                <a
                  href={getTelegramLink(telegram, "Hello TurkUztan!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full glass p-2.5 text-sand-300 transition hover:text-gold-400"
                  aria-label="Telegram"
                >
                  <Send className="h-5 w-5" />
                </a>
              )}
              <a
                href={`mailto:${email}`}
                className="rounded-full glass p-2.5 text-sand-300 transition hover:text-gold-400"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full glass p-2.5 text-sand-300 transition hover:text-gold-400"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-sand-500">
          © {new Date().getFullYear()} {BRAND.name}. {t(locale, "footer.rights")}
        </div>
      </div>
    </footer>
  );
}
