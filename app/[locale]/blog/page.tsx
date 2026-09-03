import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTA from "@/components/CTA";
import { t } from "@/lib/translations";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getPublishedBlogPosts, getSiteSettings, pickLocale } from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: `${t(locale as Locale, "page.blog.title")} | TourFix` };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [posts, settings] = await Promise.all([
    getPublishedBlogPosts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="font-display text-5xl font-light text-sand-50">
              {t(locale, "page.blog.title")}
            </h1>
            <p className="mt-4 text-sand-400">{t(locale, "page.blog.subtitle")}</p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-sand-400">{t(locale, "page.blog.coming")}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="card-glow group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  {post.cover?.url && (
                    <div className="relative h-44 overflow-hidden bg-sand-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover.url}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="font-display text-xl text-sand-50">
                      {pickLocale(post.title, locale)}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm text-sand-400">
                      {pickLocale(post.excerpt, locale)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
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
