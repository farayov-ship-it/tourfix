import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getBlogPostBySlug, pickLocale } from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const body = pickLocale(post.body, locale);

  return (
    <article className="pb-24 pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/blog`} className="text-sm text-gold-400 hover:underline">
          ← Blog
        </Link>
        <h1 className="mt-6 font-display text-4xl font-light text-sand-50 sm:text-5xl">
          {pickLocale(post.title, locale)}
        </h1>
        {post.publishedAt && (
          <p className="mt-3 text-sm text-sand-500">
            {new Date(post.publishedAt).toLocaleDateString(locale)}
          </p>
        )}
        <div className="prose prose-invert mt-10 max-w-none whitespace-pre-wrap text-sand-200">
          {body}
        </div>
      </div>
    </article>
  );
}
