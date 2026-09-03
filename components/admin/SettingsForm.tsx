"use client";

import { useState } from "react";
import { saveSettings } from "@/lib/admin/actions";
import { Field, fieldClass, btnPrimary } from "@/components/admin/ui";

type SettingsData = {
  whatsapp: string;
  telegram: string;
  email: string;
  instagram: string;
  defaultBookingChannel: string;
  stats: string;
  silkRouteStops: string;
  messageTemplates: string;
  homeVehiclesLimit: number;
  homeGuidesLimit: number;
  homeDayTripsLimit: number;
  homeRoutesLimit: number;
  telegramBotToken: string;
  telegramWebhookSecret: string;
  mediaDriver: string;
  translationProvider: string;
  translationApiKey: string;
  translationApiUrl: string;
};

const tabs = [
  { id: "contacts", label: "Kontaktlar" },
  { id: "telegram", label: "Telegram bot" },
  { id: "translate", label: "Avto-tarjima" },
  { id: "media", label: "Media" },
  { id: "content", label: "Kontent" },
] as const;

export default function SettingsForm({ defaults }: { defaults: SettingsData }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("contacts");

  return (
    <form action={saveSettings} className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              tab === t.id
                ? "bg-[#002040] font-semibold text-white"
                : "text-zinc-600 hover:bg-[#B08040]/10 hover:text-[#002040]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <section className={tab === "contacts" ? "grid gap-3 sm:grid-cols-2" : "hidden"}>
            <Field label="WhatsApp" hint="E.164: +998901234567">
              <input name="whatsapp" defaultValue={defaults.whatsapp} className={fieldClass} />
            </Field>
            <Field label="Telegram username">
              <input name="telegram" defaultValue={defaults.telegram} className={fieldClass} placeholder="turkuztan_uz" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" defaultValue={defaults.email} className={fieldClass} />
            </Field>
            <Field label="Instagram">
              <input name="instagram" defaultValue={defaults.instagram} className={fieldClass} />
            </Field>
            <Field label="Standart bron kanali">
              <select name="defaultBookingChannel" defaultValue={defaults.defaultBookingChannel} className={fieldClass}>
                <option value="ask">Foydalanuvchi tanlaydi</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
            </Field>
        </section>

        <section className={tab === "telegram" ? "space-y-3" : "hidden"}>
            <p className="text-xs text-zinc-500">
              BotFather dan token oling. Webhook: <code className="text-zinc-400">/api/telegram/webhook</code>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Bot token">
                <input
                  name="telegramBotToken"
                  type="password"
                  defaultValue={defaults.telegramBotToken}
                  className={fieldClass}
                  autoComplete="off"
                />
              </Field>
              <Field label="Webhook secret (ixtiyoriy)">
                <input
                  name="telegramWebhookSecret"
                  type="password"
                  defaultValue={defaults.telegramWebhookSecret}
                  className={fieldClass}
                  autoComplete="off"
                />
              </Field>
            </div>
        </section>

        <section className={tab === "translate" ? "grid gap-3 sm:grid-cols-2" : "hidden"}>
            <Field label="Provayder">
              <select name="translationProvider" defaultValue={defaults.translationProvider} className={fieldClass}>
                <option value="google">Google (bepul)</option>
                <option value="mymemory">MyMemory (bepul)</option>
                <option value="deepl">DeepL (API kalit)</option>
                <option value="libre">LibreTranslate</option>
              </select>
            </Field>
            <Field label="API kalit">
              <input
                name="translationApiKey"
                type="password"
                defaultValue={defaults.translationApiKey}
                className={fieldClass}
                autoComplete="off"
              />
            </Field>
            <Field label="LibreTranslate URL" className="sm:col-span-2">
              <input
                name="translationApiUrl"
                defaultValue={defaults.translationApiUrl}
                className={fieldClass}
                placeholder="https://libretranslate.com"
              />
            </Field>
        </section>

        <section className={tab === "media" ? "" : "hidden"}>
            <Field label="Media saqlash">
              <select name="mediaDriver" defaultValue={defaults.mediaDriver} className={fieldClass}>
                <option value="local">Local (public/uploads)</option>
                <option value="s3">S3 (keyinroq)</option>
              </select>
            </Field>
        </section>

        <section className={tab === "content" ? "space-y-4" : "hidden"}>
            <Field label="Statistika (JSON)" hint="Bosh sahifa raqamlari">
              <textarea name="stats" defaultValue={defaults.stats} rows={3} className={fieldClass} />
            </Field>
            <Field label="Ipak yo‘li to‘xtashlari (JSON array)">
              <textarea name="silkRouteStops" defaultValue={defaults.silkRouteStops} rows={2} className={fieldClass} />
            </Field>
            <Field label="Xabar shablonlari (JSON)">
              <textarea name="messageTemplates" defaultValue={defaults.messageTemplates} rows={4} className={fieldClass} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Bosh sahifa: marshrutlar">
                <input name="homeRoutesLimit" type="number" defaultValue={defaults.homeRoutesLimit} className={fieldClass} />
              </Field>
              <Field label="Bosh sahifa: avtomobillar">
                <input name="homeVehiclesLimit" type="number" defaultValue={defaults.homeVehiclesLimit} className={fieldClass} />
              </Field>
              <Field label="Bosh sahifa: gidlar">
                <input name="homeGuidesLimit" type="number" defaultValue={defaults.homeGuidesLimit} className={fieldClass} />
              </Field>
              <Field label="Bosh sahifa: sayohatlar">
                <input name="homeDayTripsLimit" type="number" defaultValue={defaults.homeDayTripsLimit} className={fieldClass} />
              </Field>
            </div>
        </section>
      </div>

      <button type="submit" className={btnPrimary}>
        Saqlash
      </button>
    </form>
  );
}
