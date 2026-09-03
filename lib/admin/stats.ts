import { prisma } from "@/lib/db/prisma";

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  new: "Yangi",
  contacted: "Bog‘lanildi",
  confirmed: "Tasdiqlangan",
  closed: "Yopilgan",
  spam: "Spam",
};

export const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysAgo(n: number) {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - n);
  return d;
}

export async function getDashboardStats() {
  // Serverless’da har requestda juda ko‘p parallel query ishlasa, DB’ga ulanib qolish tezlashadi.
  // Shu sabab dashboard stats’ni qisqa TTL bilan cache qilamiz va query’larni batch’lab olamiz.
  const CACHE_TTL_MS = 20_000;
  const g = globalThis as unknown as {
    __dashboardStatsCache?: {
      at: number;
      value: unknown;
      inFlight: Promise<unknown> | null;
    };
  };

  const cache = g.__dashboardStatsCache;
  const now = Date.now();
  if (cache?.value && cache.at && now - cache.at < CACHE_TTL_MS) {
    return cache.value as DashboardStats;
  }
  if (cache?.inFlight) {
    return cache.inFlight as Promise<DashboardStats>;
  }

  const inFlight = (async () => {
    const nowDate = new Date();
    const todayStart = startOfDay(nowDate);
    const weekStart = daysAgo(6);
    const prevWeekStart = daysAgo(13);
    const chartStart = daysAgo(13);
    const monthStart = daysAgo(29);

    // 1-batch: faqat booking statlar + status/channel group.
    const [
      newBookings,
      bookingsToday,
      bookingsThisWeek,
      bookingsPrevWeek,
      bookingsMonth,
      confirmedMonth,
      statusGroups,
      channelGroups,
    ] = await Promise.all([
      prisma.bookingRequest.count({ where: { status: "new" } }),
      prisma.bookingRequest.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.bookingRequest.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.bookingRequest.count({
        where: { createdAt: { gte: prevWeekStart, lt: weekStart } },
      }),
      prisma.bookingRequest.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.bookingRequest.count({
        where: { status: "confirmed", createdAt: { gte: monthStart } },
      }),
      prisma.bookingRequest.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.bookingRequest.groupBy({
        by: ["preferredChannel"],
        _count: { _all: true },
      }),
    ]);

    // 2-batch: recent booking + inventory counts.
    const [
      recentBookings,
      routesPublished,
      routesDraft,
      vehiclesPublished,
      guidesPublished,
      dayTripsPublished,
      reviewsPublished,
      blogPublished,
      blogDraft,
      localesEnabled,
    ] = await Promise.all([
      prisma.bookingRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          name: true,
          phone: true,
          fromPlace: true,
          toPlace: true,
          travelDate: true,
          status: true,
          preferredChannel: true,
          source: true,
          createdAt: true,
        },
      }),
      prisma.route.count({ where: { status: "published" } }),
      prisma.route.count({ where: { status: "draft" } }),
      prisma.vehicle.count({ where: { status: "published" } }),
      prisma.guide.count({ where: { status: "published" } }),
      prisma.dayTrip.count({ where: { status: "published" } }),
      prisma.review.count({ where: { status: "published" } }),
      prisma.blogPost.count({ where: { status: "published" } }),
      prisma.blogPost.count({ where: { status: "draft" } }),
      prisma.locale.count({ where: { enabled: true } }),
    ]);

    // 3-batch: review avg, audit list, qolgan inventory counts.
    const [avgReview, recentAudit, mediaCount, faqCount, destinationsCount] = await Promise.all([
      prisma.review.aggregate({
        where: { status: "published" },
        _avg: { rating: true },
        _count: { _all: true },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.mediaAsset.count(),
      prisma.faqItem.count({ where: { status: "published" } }),
      prisma.destination.count({ where: { published: true } }),
    ]);

    const chartBookings = await prisma.bookingRequest.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true, status: true },
    });

    const byDayMap = new Map<string, { total: number; new: number; confirmed: number }>();
    for (let i = 13; i >= 0; i--) {
      const key = dayKey(daysAgo(i));
      byDayMap.set(key, { total: 0, new: 0, confirmed: 0 });
    }
    for (const b of chartBookings) {
      const key = dayKey(b.createdAt);
      const row = byDayMap.get(key);
      if (!row) continue;
      row.total += 1;
      if (b.status === "new") row.new += 1;
      if (b.status === "confirmed") row.confirmed += 1;
    }

    const bookingsByDay = Array.from(byDayMap.entries()).map(([date, v]) => ({
      date,
      label: date.slice(5), // MM-DD
      ...v,
    }));

    const statusChart = statusGroups.map((g) => ({
      key: g.status,
      name: BOOKING_STATUS_LABELS[g.status] ?? g.status,
      value: g._count._all,
    }));

    const channelChart = channelGroups.map((g) => ({
      key: g.preferredChannel,
      name: CHANNEL_LABELS[g.preferredChannel] ?? g.preferredChannel,
      value: g._count._all,
    }));

    const weekDelta =
      bookingsPrevWeek === 0
        ? bookingsThisWeek > 0
          ? 100
          : 0
        : Math.round(((bookingsThisWeek - bookingsPrevWeek) / bookingsPrevWeek) * 100);

    return {
      kpis: {
        newBookings,
        bookingsToday,
        bookingsThisWeek,
        bookingsPrevWeek,
        weekDelta,
        bookingsMonth,
        confirmedMonth,
        avgRating: Number((avgReview._avg.rating ?? 0).toFixed(1)),
        reviewCount: avgReview._count._all,
        drafts: routesDraft + blogDraft,
        routesDraft,
        blogDraft,
        localesEnabled,
      },
      charts: {
        bookingsByDay,
        statusChart,
        channelChart,
      },
      inventory: [
        { label: "Marshrutlar", value: routesPublished, href: "/admin/routes", hint: "nashr" },
        { label: "Avtomobillar", value: vehiclesPublished, href: "/admin/vehicles", hint: "nashr" },
        { label: "Gidlar", value: guidesPublished, href: "/admin/guides", hint: "nashr" },
        { label: "Day trips", value: dayTripsPublished, href: "/admin/day-trips", hint: "nashr" },
        { label: "Manzillar", value: destinationsCount, href: "/admin/destinations", hint: "nashr" },
        { label: "Sharhlar", value: reviewsPublished, href: "/admin/reviews", hint: "nashr" },
        { label: "Blog", value: blogPublished, href: "/admin/blog", hint: "nashr" },
        { label: "FAQ", value: faqCount, href: "/admin/faq", hint: "nashr" },
        { label: "Media", value: mediaCount, href: "/admin/media", hint: "fayl" },
      ],
      recentBookings,
      recentAudit,
    } as DashboardStats;
  })();

  g.__dashboardStatsCache = {
    at: cache?.at ?? 0,
    value: cache?.value ?? null,
    inFlight,
  };

  try {
    const value = await inFlight;
    g.__dashboardStatsCache = { at: Date.now(), value, inFlight: null };
    return value as DashboardStats;
  } catch (e) {
    if (g.__dashboardStatsCache) g.__dashboardStatsCache.inFlight = null;
    throw e;
  }
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
