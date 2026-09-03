import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  buildBookingMessage,
  getTelegramLink,
  getWhatsAppLink,
} from "@/lib/messaging";

const rateMap = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const row = rateMap.get(ip);
  if (!row || now - row.ts > 60_000) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }
  if (row.count >= 10) return false;
  row.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    // honeypot
    if (body.website || body.hp) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
    }

    const channel =
      body.preferredChannel === "telegram" ? "telegram" : "whatsapp";

    const booking = await prisma.bookingRequest.create({
      data: {
        name,
        phone,
        fromPlace: body.from ? String(body.from) : null,
        toPlace: body.to ? String(body.to) : null,
        travelDate: body.date ? String(body.date) : null,
        passengers: body.passengers ? Number(body.passengers) : null,
        vehicleCategory: body.category ? String(body.category) : null,
        priceHint: body.price ? Number(body.price) : null,
        preferredChannel: channel,
        source: "web",
        locale: body.locale ? String(body.locale) : null,
        status: "new",
      },
    });

    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const message = buildBookingMessage({
      name,
      phone,
      from: body.from,
      to: body.to,
      date: body.date,
      passengers: body.passengers,
      category: body.category,
      priceHint: body.price ? Number(body.price) : undefined,
      locale: body.locale,
    });

    let deepLink = "";
    if (channel === "telegram" && settings?.telegram) {
      deepLink = getTelegramLink(settings.telegram, message);
    } else if (settings?.whatsapp) {
      deepLink = getWhatsAppLink(settings.whatsapp, message);
    }

    return NextResponse.json({
      ok: true,
      id: booking.id,
      deepLink,
      channel,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
