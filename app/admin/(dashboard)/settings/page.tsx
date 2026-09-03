import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin");

  const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  const defaults = {
    whatsapp: s?.whatsapp ?? "",
    telegram: s?.telegram ?? "",
    email: s?.email ?? "",
    instagram: s?.instagram ?? "",
    defaultBookingChannel: s?.defaultBookingChannel ?? "ask",
    stats: s?.stats ?? "{}",
    silkRouteStops: s?.silkRouteStops ?? "[]",
    messageTemplates: s?.messageTemplates ?? "{}",
    homeVehiclesLimit: s?.homeVehiclesLimit ?? 6,
    homeGuidesLimit: s?.homeGuidesLimit ?? 3,
    homeDayTripsLimit: s?.homeDayTripsLimit ?? 3,
    homeRoutesLimit: s?.homeRoutesLimit ?? 6,
    telegramBotToken: s?.telegramBotToken ?? "",
    telegramWebhookSecret: s?.telegramWebhookSecret ?? "",
    mediaDriver: s?.mediaDriver ?? "local",
    translationProvider: s?.translationProvider ?? "google",
    translationApiKey: s?.translationApiKey ?? "",
    translationApiUrl: s?.translationApiUrl ?? "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sozlamalar</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kontaktlar, Telegram bot, avto-tarjima va kontent — bo‘limlar bo‘yicha
        </p>
      </div>

      <SettingsForm defaults={defaults} />

      <p className="text-xs text-zinc-600">
        Faqat texnik: DATABASE_URL va AUTH_SECRET .env da qoladi. Admin parolini{" "}
        <a className="text-amber-500 underline" href="/admin/users">
          Foydalanuvchilar
        </a>{" "}
        bo‘limidan o‘zgartirasiz.
      </p>
    </div>
  );
}
