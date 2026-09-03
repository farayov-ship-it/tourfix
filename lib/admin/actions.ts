"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { MAX_ENABLED_LOCALES, stringifyLocaleMap, type LocaleMap } from "@/lib/locale-map";
import { slugify } from "@/components/admin/labels";
import bcrypt from "bcryptjs";

async function audit(userId: string | undefined, action: string, entity: string, entityId?: string, diff?: unknown) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      diff: diff ? JSON.stringify(diff) : null,
    },
  });
}

export async function revalidateContent() {
  revalidatePath("/", "layout");
  revalidateTag("content");
}

/* ─── Locales ─── */
export async function upsertLocale(formData: FormData) {
  const session = await requireAdmin(["owner"]);
  const id = String(formData.get("id") || "");
  const code = String(formData.get("code") || "").toLowerCase().trim();
  const enabled = formData.get("enabled") === "on" || formData.get("enabled") === "true";
  const isDefault = formData.get("isDefault") === "on" || formData.get("isDefault") === "true";

  if (!/^[a-z]{2,5}$/.test(code)) throw new Error("Invalid locale code");

  if (enabled) {
    const count = await prisma.locale.count({
      where: { enabled: true, ...(id ? { NOT: { id } } : {}) },
    });
    if (count >= MAX_ENABLED_LOCALES) throw new Error(`Max ${MAX_ENABLED_LOCALES} enabled locales`);
  }

  const data = {
    code,
    name: String(formData.get("name") || code),
    nativeName: String(formData.get("nativeName") || code),
    flag: String(formData.get("flag") || ""),
    enabled,
    isDefault,
    sortOrder: Number(formData.get("sortOrder") || 0),
    dir: String(formData.get("dir") || "ltr") === "rtl" ? "rtl" : "ltr",
  };

  if (isDefault) {
    await prisma.locale.updateMany({ data: { isDefault: false } });
  }

  const row = id
    ? await prisma.locale.update({ where: { id }, data })
    : await prisma.locale.create({ data });

  await audit(session.user.id, id ? "update" : "create", "Locale", row.id, data);
  await revalidateContent();
  redirect("/admin/locales");
}

export async function deleteLocale(formData: FormData) {
  const session = await requireAdmin(["owner"]);
  const id = String(formData.get("id"));
  const loc = await prisma.locale.findUnique({ where: { id } });
  if (loc?.isDefault) throw new Error("Cannot delete default locale");
  await prisma.locale.delete({ where: { id } });
  await audit(session.user.id, "delete", "Locale", id);
  await revalidateContent();
}

/* ─── Settings ─── */
export async function saveSettings(formData: FormData) {
  const session = await requireAdmin(["owner"]);
  const data = {
    whatsapp: String(formData.get("whatsapp") || ""),
    telegram: String(formData.get("telegram") || ""),
    email: String(formData.get("email") || ""),
    instagram: String(formData.get("instagram") || ""),
    defaultBookingChannel: String(formData.get("defaultBookingChannel") || "ask"),
    stats: String(formData.get("stats") || "{}"),
    silkRouteStops: String(formData.get("silkRouteStops") || "[]"),
    messageTemplates: String(formData.get("messageTemplates") || "{}"),
    homeVehiclesLimit: Number(formData.get("homeVehiclesLimit") || 6),
    homeGuidesLimit: Number(formData.get("homeGuidesLimit") || 3),
    homeDayTripsLimit: Number(formData.get("homeDayTripsLimit") || 3),
    homeRoutesLimit: Number(formData.get("homeRoutesLimit") || 6),
    telegramBotToken: String(formData.get("telegramBotToken") || ""),
    telegramWebhookSecret: String(formData.get("telegramWebhookSecret") || ""),
    mediaDriver: String(formData.get("mediaDriver") || "local") === "s3" ? "s3" : "local",
    translationProvider: String(formData.get("translationProvider") || "google"),
    translationApiKey: String(formData.get("translationApiKey") || ""),
    translationApiUrl: String(formData.get("translationApiUrl") || ""),
  };
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
  await audit(session.user.id, "update", "SiteSettings", "default", {
    ...data,
    telegramBotToken: data.telegramBotToken ? "[set]" : "",
    telegramWebhookSecret: data.telegramWebhookSecret ? "[set]" : "",
    translationApiKey: data.translationApiKey ? "[set]" : "",
  });
  await revalidateContent();
  redirect("/admin/settings");
}

/* ─── Generic helpers for LocaleMap fields from form prefix ─── */
function localeMapFromForm(formData: FormData, prefix: string): LocaleMap {
  const map: LocaleMap = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(`${prefix}.`) && typeof value === "string") {
      const code = key.slice(prefix.length + 1);
      if (code) map[code] = value;
    }
  }
  return map;
}

/* ─── Routes ─── */
export async function saveRoute(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const fromName = String(formData.get("fromName") || "").trim();
  const toName = String(formData.get("toName") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(`${fromName}-${toName}`) || `route-${Date.now()}`;
  const data = {
    slug,
    fromName,
    toName,
    price: Number(formData.get("price") || 0),
    duration: String(formData.get("duration") || ""),
    distance: String(formData.get("distance") || ""),
    popular: formData.get("popular") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published" | "archived"),
    imageId: String(formData.get("imageId") || "") || null,
  };
  const row = id
    ? await prisma.route.update({ where: { id }, data })
    : await prisma.route.create({ data });
  await audit(session.user.id, id ? "update" : "create", "Route", row.id);
  await revalidateContent();
  redirect("/admin/routes");
}

export async function deleteRoute(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.route.delete({ where: { id } });
  await audit(session.user.id, "delete", "Route", id);
  await revalidateContent();
}

/* ─── Vehicles ─── */
export async function saveVehicle(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(name) || `vehicle-${Date.now()}`;
  const data = {
    slug,
    name,
    category: String(formData.get("category") || "economy"),
    capacity: Number(formData.get("capacity") || 4),
    priceFrom: Number(formData.get("priceFrom") || 0),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published" | "archived"),
    imageId: String(formData.get("imageId") || "") || null,
  };
  const row = id
    ? await prisma.vehicle.update({ where: { id }, data })
    : await prisma.vehicle.create({ data });
  await audit(session.user.id, id ? "update" : "create", "Vehicle", row.id);
  await revalidateContent();
  redirect("/admin/vehicles");
}

export async function deleteVehicle(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.vehicle.delete({ where: { id } });
  await audit(session.user.id, "delete", "Vehicle", id);
  await revalidateContent();
}

/* ─── Guides ─── */
export async function saveGuide(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(name) || `guide-${Date.now()}`;
  const langs = String(formData.get("languages") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const data = {
    slug,
    name,
    city: String(formData.get("city") || ""),
    languages: JSON.stringify(langs),
    rating: Number(formData.get("rating") || 5),
    reviewsCount: Number(formData.get("reviewsCount") || 0),
    pricePerDay: Number(formData.get("pricePerDay") || 0),
    specialty: stringifyLocaleMap(localeMapFromForm(formData, "specialty")),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published" | "archived"),
    imageId: String(formData.get("imageId") || "") || null,
  };
  const row = id
    ? await prisma.guide.update({ where: { id }, data })
    : await prisma.guide.create({ data });
  await audit(session.user.id, id ? "update" : "create", "Guide", row.id);
  await revalidateContent();
  redirect("/admin/guides");
}

export async function deleteGuide(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.guide.delete({ where: { id } });
  await audit(session.user.id, "delete", "Guide", id);
  await revalidateContent();
}

/* ─── Day trips ─── */
export async function saveDayTrip(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = localeMapFromForm(formData, "title");
  const highlightsRaw = localeMapFromForm(formData, "highlights");
  const highlights: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(highlightsRaw)) {
    highlights[k] = v.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(title.uz || title.en || title.ru || "day-trip") || `dt-${Date.now()}`;
  const data = {
    slug,
    title: stringifyLocaleMap(title),
    city: String(formData.get("city") || ""),
    duration: String(formData.get("duration") || ""),
    price: Number(formData.get("price") || 0),
    highlights: JSON.stringify(highlights),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published" | "archived"),
    imageId: String(formData.get("imageId") || "") || null,
  };
  const row = id
    ? await prisma.dayTrip.update({ where: { id }, data })
    : await prisma.dayTrip.create({ data });
  await audit(session.user.id, id ? "update" : "create", "DayTrip", row.id);
  await revalidateContent();
  redirect("/admin/day-trips");
}

export async function deleteDayTrip(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.dayTrip.delete({ where: { id } });
  await audit(session.user.id, "delete", "DayTrip", id);
  await revalidateContent();
}

/* ─── Reviews ─── */
export async function saveReview(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    name: String(formData.get("name") || ""),
    country: String(formData.get("country") || ""),
    rating: Number(formData.get("rating") || 5),
    text: stringifyLocaleMap(localeMapFromForm(formData, "text")),
    date: new Date(String(formData.get("date") || new Date().toISOString())),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published" | "archived"),
  };
  const row = id
    ? await prisma.review.update({ where: { id }, data })
    : await prisma.review.create({ data });
  await audit(session.user.id, id ? "update" : "create", "Review", row.id);
  await revalidateContent();
  redirect("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.review.delete({ where: { id } });
  await audit(session.user.id, "delete", "Review", id);
  await revalidateContent();
}

/* ─── Destinations ─── */
export async function saveDestination(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = localeMapFromForm(formData, "name");
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(name.uz || name.en || name.ru || "dest") || `dest-${Date.now()}`;
  const data = {
    slug,
    name: stringifyLocaleMap(name),
    tagline: stringifyLocaleMap(localeMapFromForm(formData, "tagline")),
    sortOrder: Number(formData.get("sortOrder") || 0),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    imageId: String(formData.get("imageId") || "") || null,
  };
  const row = id
    ? await prisma.destination.update({ where: { id }, data })
    : await prisma.destination.create({ data });
  await audit(session.user.id, id ? "update" : "create", "Destination", row.id);
  await revalidateContent();
  redirect("/admin/destinations");
}

export async function deleteDestination(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.destination.delete({ where: { id } });
  await audit(session.user.id, "delete", "Destination", id);
  await revalidateContent();
}

/* ─── Cities ─── */
export async function saveCity(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = localeMapFromForm(formData, "name");
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(name.uz || name.en || name.ru || "city") || `city-${Date.now()}`;
  const data = {
    slug,
    name: stringifyLocaleMap(name),
    isAirport: formData.get("isAirport") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  const row = id
    ? await prisma.city.update({ where: { id }, data })
    : await prisma.city.create({ data });
  await audit(session.user.id, id ? "update" : "create", "City", row.id);
  await revalidateContent();
  redirect("/admin/cities");
}

export async function deleteCity(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.city.delete({ where: { id } });
  await audit(session.user.id, "delete", "City", id);
  await revalidateContent();
}

/* ─── Blog ─── */
export async function saveBlogPost(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "draft") as "draft" | "published" | "archived";
  const title = localeMapFromForm(formData, "title");
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(title.uz || title.en || title.ru || "post") || `post-${Date.now()}`;
  const data = {
    slug,
    title: stringifyLocaleMap(title),
    excerpt: stringifyLocaleMap(localeMapFromForm(formData, "excerpt")),
    body: stringifyLocaleMap(localeMapFromForm(formData, "body")),
    status,
    publishedAt: status === "published" ? new Date() : null,
    coverId: String(formData.get("coverId") || "") || null,
  };
  const row = id
    ? await prisma.blogPost.update({
        where: { id },
        data: {
          ...data,
          publishedAt:
            status === "published"
              ? (await prisma.blogPost.findUnique({ where: { id } }))?.publishedAt ?? new Date()
              : null,
        },
      })
    : await prisma.blogPost.create({ data });
  await audit(session.user.id, id ? "update" : "create", "BlogPost", row.id);
  await revalidateContent();
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.blogPost.delete({ where: { id } });
  await audit(session.user.id, "delete", "BlogPost", id);
  await revalidateContent();
}

/* ─── FAQ ─── */
export async function saveFaq(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    question: stringifyLocaleMap(localeMapFromForm(formData, "question")),
    answer: stringifyLocaleMap(localeMapFromForm(formData, "answer")),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published" | "archived"),
  };
  const row = id
    ? await prisma.faqItem.update({ where: { id }, data })
    : await prisma.faqItem.create({ data });
  await audit(session.user.id, id ? "update" : "create", "FaqItem", row.id);
  await revalidateContent();
  redirect("/admin/faq");
}

export async function deleteFaq(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.faqItem.delete({ where: { id } });
  await audit(session.user.id, "delete", "FaqItem", id);
  await revalidateContent();
}

/* ─── UiCopy ─── */
export async function saveUiCopy(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const key = String(formData.get("key") || "").trim();
  const data = {
    key,
    group: String(formData.get("group") || key.split(".")[0] || "general"),
    value: stringifyLocaleMap(localeMapFromForm(formData, "value")),
  };
  const row = id
    ? await prisma.uiCopy.update({ where: { id }, data })
    : await prisma.uiCopy.create({ data });
  await audit(session.user.id, id ? "update" : "create", "UiCopy", row.id);
  await revalidateContent();
  redirect("/admin/translations");
}

export async function deleteUiCopy(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.uiCopy.delete({ where: { id } });
  await audit(session.user.id, "delete", "UiCopy", id);
  await revalidateContent();
}

/* ─── SEO ─── */
export async function saveSeo(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("path") || "").trim();
  const data = {
    path,
    title: stringifyLocaleMap(localeMapFromForm(formData, "title")),
    description: stringifyLocaleMap(localeMapFromForm(formData, "description")),
  };
  const row = id
    ? await prisma.seoPage.update({ where: { id }, data })
    : await prisma.seoPage.create({ data });
  await audit(session.user.id, id ? "update" : "create", "SeoPage", row.id);
  await revalidateContent();
  redirect("/admin/seo");
}

export async function deleteSeo(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.seoPage.delete({ where: { id } });
  await audit(session.user.id, "delete", "SeoPage", id);
  await revalidateContent();
}

/* ─── Bookings ─── */
export async function updateBooking(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status") || "new") as
    | "new"
    | "contacted"
    | "confirmed"
    | "closed"
    | "spam";
  const adminNote = String(formData.get("adminNote") || "");
  await prisma.bookingRequest.update({
    where: { id },
    data: { status, adminNote },
  });
  await audit(session.user.id, "update", "BookingRequest", id, { status });
}

/* ─── Users ─── */
export async function saveUser(formData: FormData) {
  const session = await requireAdmin(["owner"]);
  const id = String(formData.get("id") || "");
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const role = String(formData.get("role") || "editor") === "owner" ? "owner" : "editor";
  const name = String(formData.get("name") || "");
  const password = String(formData.get("password") || "");

  if (id) {
    const data: { email: string; role: "owner" | "editor"; name: string; passwordHash?: string } = {
      email,
      role,
      name,
    };
    if (password) data.passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.update({ where: { id }, data });
    await audit(session.user.id, "update", "AdminUser", id);
  } else {
    if (!password) throw new Error("Password required");
    const row = await prisma.adminUser.create({
      data: {
        email,
        role,
        name,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    await audit(session.user.id, "create", "AdminUser", row.id);
  }
  await revalidateContent();
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin(["owner"]);
  const id = String(formData.get("id"));
  if (id === session.user.id) throw new Error("Cannot delete yourself");
  await prisma.adminUser.delete({ where: { id } });
  await audit(session.user.id, "delete", "AdminUser", id);
}

/* ─── Copy locale values helper ─── */
export async function copyLocaleContent(formData: FormData) {
  const session = await requireAdmin(["owner"]);
  const from = String(formData.get("from") || "en");
  const to = String(formData.get("to") || "");
  if (!to || from === to) throw new Error("Invalid locales");

  const copies = await prisma.uiCopy.findMany();
  for (const row of copies) {
    const map = JSON.parse(row.value || "{}") as LocaleMap;
    if (map[from] && !map[to]) {
      map[to] = map[from];
      await prisma.uiCopy.update({
        where: { id: row.id },
        data: { value: JSON.stringify(map) },
      });
    }
  }
  await audit(session.user.id, "copy", "UiCopy", undefined, { from, to });
  await revalidateContent();
  redirect("/admin/translations/tools");
}
