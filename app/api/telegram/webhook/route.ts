import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * Telegram Bot webhook — creates BookingRequest from incoming messages.
 * Token/secret: Admin → Sozlamalar (fallback: env).
 */
export async function POST(req: Request) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const botToken = settings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || "";
  const webhookSecret =
    settings?.telegramWebhookSecret || process.env.TELEGRAM_WEBHOOK_SECRET || "";

  if (webhookSecret) {
    const hdr = req.headers.get("x-telegram-bot-api-secret-token");
    if (hdr !== webhookSecret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (!botToken) {
    return NextResponse.json({ ok: true, skipped: true, reason: "no bot token" });
  }

  try {
    const update = await req.json();
    const msg = update?.message;
    if (!msg?.chat?.id) return NextResponse.json({ ok: true });

    const text = String(msg.text || "").trim();
    const chatId = String(msg.chat.id);
    const fromName =
      [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ") ||
      msg.from?.username ||
      "Telegram user";

    if (text === "/start") {
      await sendTelegram(
        botToken,
        chatId,
        "TurkUztan botiga xush kelibsiz!\nAriza uchun: ismingiz, telefon, qayerdan → qayerga yozing."
      );
      return NextResponse.json({ ok: true });
    }

    if (text.length < 3) return NextResponse.json({ ok: true });

    await prisma.bookingRequest.create({
      data: {
        name: fromName,
        phone: msg.from?.username ? `@${msg.from.username}` : chatId,
        notes: text,
        preferredChannel: "telegram",
        source: "telegram_bot",
        telegramChatId: chatId,
        status: "new",
      },
    });

    await sendTelegram(
      botToken,
      chatId,
      "Rahmat! Arizangiz qabul qilindi. Tez orada bog'lanamiz."
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("telegram webhook", e);
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegram(token: string, chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
