import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { pickLocale, parseLocaleMap, parseJsonArray, parseLocaleStringArrays, pickLocaleList } from "@/lib/locale-map";

export const getEnabledLocales = cache(async () => {
  return prisma.locale.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getDefaultLocaleCode = cache(async () => {
  const d = await prisma.locale.findFirst({ where: { isDefault: true, enabled: true } });
  if (d) return d.code;
  const first = await prisma.locale.findFirst({ where: { enabled: true }, orderBy: { sortOrder: "asc" } });
  return first?.code ?? "en";
});

export const getSiteSettings = cache(async () => {
  return (
    (await prisma.siteSettings.findUnique({ where: { id: "default" } })) ??
    null
  );
});

export const getPublishedRoutes = cache(async (limit?: number) => {
  return prisma.route.findMany({
    where: { status: "published" },
    include: { image: true },
    orderBy: [{ popular: "desc" }, { sortOrder: "asc" }],
    take: limit,
  });
});

export const getPublishedVehicles = cache(async (limit?: number) => {
  return prisma.vehicle.findMany({
    where: { status: "published" },
    include: { image: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
});

export const getPublishedGuides = cache(async (limit?: number) => {
  return prisma.guide.findMany({
    where: { status: "published" },
    include: { image: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
});

export const getPublishedDayTrips = cache(async (limit?: number) => {
  return prisma.dayTrip.findMany({
    where: { status: "published" },
    include: { image: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
});

export const getPublishedReviews = cache(async () => {
  return prisma.review.findMany({
    where: { status: "published" },
    orderBy: { sortOrder: "asc" },
  });
});

export const getDestinations = cache(async () => {
  return prisma.destination.findMany({
    where: { published: true },
    include: { image: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getCities = cache(async () => {
  return prisma.city.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getFaqs = cache(async () => {
  return prisma.faqItem.findMany({
    where: { status: "published" },
    orderBy: { sortOrder: "asc" },
  });
});

export const getUiCopyMap = cache(async () => {
  const rows = await prisma.uiCopy.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

export async function tDb(
  copyMap: Record<string, string>,
  locale: string,
  key: string,
  fallbackKey?: string
) {
  const raw = copyMap[key];
  if (raw) {
    const v = pickLocale(raw, locale);
    if (v) return v;
  }
  if (fallbackKey && copyMap[fallbackKey]) {
    return pickLocale(copyMap[fallbackKey], locale) || key;
  }
  return key;
}

export function makeT(copyMap: Record<string, string>, locale: string) {
  return (key: string) => {
    const raw = copyMap[key];
    if (!raw) return key;
    return pickLocale(raw, locale) || key;
  };
}

export const getPublishedBlogPosts = cache(async () => {
  return prisma.blogPost.findMany({
    where: { status: "published" },
    include: { cover: true },
    orderBy: { publishedAt: "desc" },
  });
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findFirst({
    where: { slug, status: "published" },
    include: { cover: true },
  });
});

export const getSeoPage = cache(async (path: string) => {
  return prisma.seoPage.findUnique({ where: { path } });
});

export {
  pickLocale,
  parseLocaleMap,
  parseJsonArray,
  parseLocaleStringArrays,
  pickLocaleList,
};
