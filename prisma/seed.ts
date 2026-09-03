import { PrismaClient, AdminRole, PublishStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { routes, vehicles, guides, dayTrips, reviews, cities, contact, stats } from "../lib/data";
import { images } from "../lib/images";
import { getDictionary } from "../lib/translations";

const prisma = new PrismaClient();

const LOCALES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", isDefault: true, sortOrder: 0, dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", isDefault: false, sortOrder: 1, dir: "ltr" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek", flag: "🇺🇿", isDefault: false, sortOrder: 2, dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", isDefault: false, sortOrder: 3, dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", isDefault: false, sortOrder: 4, dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", isDefault: false, sortOrder: 5, dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", isDefault: false, sortOrder: 6, dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", isDefault: false, sortOrder: 7, dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", isDefault: false, sortOrder: 8, dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", isDefault: false, sortOrder: 9, dir: "rtl" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", isDefault: false, sortOrder: 10, dir: "ltr" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", flag: "🇰🇿", isDefault: false, sortOrder: 11, dir: "ltr" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬", isDefault: false, sortOrder: 12, dir: "ltr" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯", isDefault: false, sortOrder: 13, dir: "ltr" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmençe", flag: "🇹🇲", isDefault: false, sortOrder: 14, dir: "ltr" },
];

function j(v: unknown) {
  return JSON.stringify(v);
}

async function ensureMedia(url: string, key: string) {
  const existing = await prisma.mediaAsset.findFirst({ where: { key } });
  if (existing) return existing;
  return prisma.mediaAsset.create({
    data: { url: url.split("?")[0], key, alt: "{}", mime: "image/jpeg" },
  });
}

async function main() {
  console.log("Seeding…");

  await prisma.auditLog.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.seoPage.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.uiCopy.deleteMany();
  await prisma.review.deleteMany();
  await prisma.dayTrip.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.route.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.city.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.locale.deleteMany();
  await prisma.adminUser.deleteMany();

  for (const loc of LOCALES) {
    await prisma.locale.create({ data: { ...loc, enabled: true } });
  }

  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  const editorHash = await bcrypt.hash(process.env.EDITOR_PASSWORD || "editor123", 10);
  await prisma.adminUser.create({
    data: {
      email: (process.env.ADMIN_EMAIL || "admin@turkuztan.uz").toLowerCase(),
      passwordHash: adminHash,
      name: "Owner",
      role: AdminRole.owner,
    },
  });
  await prisma.adminUser.create({
    data: {
      email: (process.env.EDITOR_EMAIL || "editor@turkuztan.uz").toLowerCase(),
      passwordHash: editorHash,
      name: "Editor",
      role: AdminRole.editor,
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: "default",
      whatsapp: contact.whatsapp,
      telegram: contact.telegram,
      email: contact.email,
      instagram: contact.instagram,
      defaultBookingChannel: "ask",
      stats: j(stats),
      silkRouteStops: j(["Tashkent", "Samarkand", "Bukhara", "Khiva"]),
      messageTemplates: j({
        whatsapp: {
          booking: { en: "Hello! I'd like to leave a transfer request." },
          guide: { en: "Hi! I'd like to book a guide." },
          dayTrip: { en: "Hi! I'm interested in a day trip." },
        },
        telegram: {
          booking: { en: "Hello! I'd like to leave a transfer request." },
          guide: { en: "Hi! I'd like to book a guide." },
          dayTrip: { en: "Hi! I'm interested in a day trip." },
        },
      }),
      heroImageMain: images.hero.main.split("?")[0],
      heroImageSecondary: images.hero.secondary.split("?")[0],
      heroImageAccent: images.hero.accent.split("?")[0],
      ctaImage: images.cta.split("?")[0],
      servicesImages: j({
        transfers: images.services.transfers.split("?")[0],
        guides: images.services.guides.split("?")[0],
        dayTrips: images.services.dayTrips.split("?")[0],
      }),
    },
  });

  for (let i = 0; i < cities.length; i++) {
    const name = cities[i];
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    await prisma.city.create({
      data: {
        slug,
        name: j({ en: name, ru: name, uz: name }),
        isAirport: false,
        sortOrder: i,
        published: true,
      },
    });
  }
  await prisma.city.create({
    data: {
      slug: "tashkent-airport",
      name: j({ en: "Tashkent Airport", ru: "Аэропорт Ташкента", uz: "Toshkent aeroporti" }),
      isAirport: true,
      sortOrder: 100,
      published: true,
    },
  });
  await prisma.city.create({
    data: {
      slug: "samarkand-airport",
      name: j({ en: "Samarkand Airport", ru: "Аэропорт Самарканда", uz: "Samarqand aeroporti" }),
      isAirport: true,
      sortOrder: 101,
      published: true,
    },
  });

  for (let i = 0; i < images.destinations.length; i++) {
    const d = images.destinations[i];
    const media = await ensureMedia(d.image, `dest-${d.id}`);
    await prisma.destination.create({
      data: {
        slug: d.id,
        name: j(d.name),
        tagline: j(d.tagline),
        sortOrder: i,
        featured: true,
        published: true,
        imageId: media.id,
      },
    });
  }

  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    const imgUrl = images.routes[r.id] ?? images.destinations[0].image;
    const media = await ensureMedia(imgUrl, `route-${r.id}`);
    await prisma.route.create({
      data: {
        slug: r.id,
        fromName: r.from,
        toName: r.to,
        price: r.price,
        duration: r.duration,
        distance: r.distance,
        popular: !!r.popular,
        sortOrder: i,
        status: PublishStatus.published,
        imageId: media.id,
      },
    });
  }

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    const imgUrl =
      images.vehiclesById[v.id] ?? images.vehicles[v.category] ?? images.vehicles.economy;
    const media = await ensureMedia(imgUrl, `vehicle-${v.id}`);
    await prisma.vehicle.create({
      data: {
        slug: v.id,
        name: v.name,
        category: v.category,
        capacity: v.capacity,
        priceFrom: v.priceFrom,
        sortOrder: i,
        status: PublishStatus.published,
        imageId: media.id,
      },
    });
  }

  for (let i = 0; i < guides.length; i++) {
    const g = guides[i];
    const imgUrl = images.guides[g.id as keyof typeof images.guides];
    const media = await ensureMedia(imgUrl, `guide-${g.id}`);
    await prisma.guide.create({
      data: {
        slug: g.id,
        name: g.name,
        city: g.city,
        languages: j(g.languages),
        rating: g.rating,
        reviewsCount: g.reviews,
        pricePerDay: g.pricePerDay,
        specialty: j({ en: g.specialty, ru: g.specialty, uz: g.specialty }),
        sortOrder: i,
        status: PublishStatus.published,
        imageId: media.id,
      },
    });
  }

  for (let i = 0; i < dayTrips.length; i++) {
    const d = dayTrips[i];
    const imgUrl = images.dayTrips[d.id as keyof typeof images.dayTrips];
    const media = await ensureMedia(imgUrl, `daytrip-${d.id}`);
    await prisma.dayTrip.create({
      data: {
        slug: d.id,
        title: j(d.title),
        city: d.city,
        duration: d.duration,
        price: d.price,
        highlights: j(d.highlights),
        sortOrder: i,
        status: PublishStatus.published,
        imageId: media.id,
      },
    });
  }

  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    await prisma.review.create({
      data: {
        name: r.name,
        country: r.country,
        rating: r.rating,
        text: j(r.text),
        date: new Date(r.date),
        sortOrder: i,
        status: PublishStatus.published,
      },
    });
  }

  const en = getDictionary("en");
  const ru = getDictionary("ru");
  const uz = getDictionary("uz");
  const keys = Object.keys(en);
  for (const key of keys) {
    const group = key.split(".")[0] || "general";
    await prisma.uiCopy.create({
      data: {
        key,
        group,
        value: j({
          en: en[key] ?? "",
          ru: ru[key] ?? "",
          uz: uz[key] ?? "",
        }),
      },
    });
  }

  for (let i = 1; i <= 5; i++) {
    await prisma.faqItem.create({
      data: {
        question: j({
          en: en[`faq.q${i}`],
          ru: ru[`faq.q${i}`],
          uz: uz[`faq.q${i}`],
        }),
        answer: j({
          en: en[`faq.a${i}`],
          ru: ru[`faq.a${i}`],
          uz: uz[`faq.a${i}`],
        }),
        sortOrder: i,
        status: PublishStatus.published,
      },
    });
  }

  const seoPaths = ["home", "transfers", "guides", "day-trips", "reviews", "blog"];
  for (const path of seoPaths) {
    await prisma.seoPage.create({
      data: {
        path,
        title: j({
          en: en[`page.${path.replace("-", "")}.title`] || en["hero.title2"] || "TourFix",
          ru: ru[`page.${path.replace("-", "")}.title`] || "TourFix",
          uz: uz[`page.${path.replace("-", "")}.title`] || "TourFix",
        }),
        description: j({
          en: en[`page.${path.replace("-", "")}.subtitle`] || "",
          ru: ru[`page.${path.replace("-", "")}.subtitle`] || "",
          uz: uz[`page.${path.replace("-", "")}.subtitle`] || "",
        }),
      },
    });
  }

  await prisma.blogPost.create({
    data: {
      slug: "welcome-to-silk-road",
      title: j({
        en: "Welcome to the Silk Road",
        ru: "Добро пожаловать на Шёлковый путь",
        uz: "Ipak yo'liga xush kelibsiz",
      }),
      excerpt: j({
        en: "How to travel between Tashkent, Samarkand, Bukhara and Khiva with private transfers.",
        ru: "Как путешествовать между городами с частным трансфером.",
        uz: "Shaharlar o'rtasida shaxsiy transfer bilan qanday sayohat qilish mumkin.",
      }),
      body: j({
        en: "## Private transfers in Uzbekistan\n\nTourFix connects travelers with local drivers and guides across the Silk Road.\n\nBook a request — we confirm details on WhatsApp or Telegram. No online payment required.",
        ru: "## Частные трансферы в Узбекистане\n\nTourFix соединяет путешественников с местными водителями и гидами.\n\nОставьте заявку — подтвердим в WhatsApp или Telegram.",
        uz: "## O'zbekistonda shaxsiy transferlar\n\nTourFix sayohatchilarni mahalliy haydovchi va gidlar bilan bog'laydi.\n\nAriza qoldiring — WhatsApp yoki Telegram orqali tasdiqlaymiz.",
      }),
      status: PublishStatus.published,
      publishedAt: new Date(),
    },
  });

  console.log("Seed complete.");
  console.log(`Admin: ${process.env.ADMIN_EMAIL || "admin@turkuztan.uz"} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
  console.log(`Editor: ${process.env.EDITOR_EMAIL || "editor@turkuztan.uz"} / ${process.env.EDITOR_PASSWORD || "editor123"}`);
  console.log(`Site: ${process.env.NEXT_PUBLIC_SITE_URL || "http://turkuztan.uz"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
