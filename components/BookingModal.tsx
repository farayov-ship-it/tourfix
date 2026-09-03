"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useBooking } from "./BookingContext";
import { useT } from "@/lib/i18n-client";
import type { Locale } from "@/lib/i18n";

interface BookingModalProps {
  locale: Locale;
  cities: Array<{ slug: string; name: string }>;
  contact: { whatsapp: string; telegram: string };
}

export default function BookingModal({ locale, cities, contact }: BookingModalProps) {
  const t = useT(locale);
  const { isOpen, data, closeBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState<"whatsapp" | "telegram">("whatsapp");
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "2",
    vehicle: "economy",
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (data.from) setForm((f) => ({ ...f, from: data.from || f.from }));
    if (data.to) setForm((f) => ({ ...f, to: data.to || f.to }));
  }, [data.from, data.to, isOpen]);

  if (!isOpen) return null;

  const initialFrom = form.from || data.from || "";
  const initialTo = form.to || data.to || "";
  const price = data.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          from: form.from || initialFrom,
          to: form.to || initialTo,
          date: form.date,
          passengers: form.passengers,
          category: form.vehicle,
          price,
          preferredChannel: channel,
          locale,
          website: "", // honeypot empty
        }),
      });
      const json = await res.json();
      if (json.deepLink) {
        window.open(json.deepLink, "_blank");
      }
      closeBooking();
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeBooking} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-strong glow-gold">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-2xl text-sand-50">{t("booking.title")}</h2>
          <button onClick={closeBooking} className="rounded-lg p-2 hover:bg-white/10" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("booking.from")}>
              <select
                required
                value={form.from || initialFrom}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="input"
              >
                <option value="">—</option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("booking.to")}>
              <select
                required
                value={form.to || initialTo}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="input"
              >
                <option value="">—</option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("booking.date")}>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input"
                min={new Date().toISOString().split("T")[0]}
              />
            </Field>
            <Field label={t("booking.passengers")}>
              <select
                value={form.passengers}
                onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                className="input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("booking.vehicle")}>
            <select
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              className="input"
            >
              {["economy", "comfort", "premium", "suv", "minivan", "van"].map((cat) => (
                <option key={cat} value={cat}>
                  {t(`category.${cat}`)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("booking.name")}>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </Field>

          <Field label={t("booking.phone")}>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input"
              placeholder="+998 90 123 45 67"
            />
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm text-sand-400">{t("booking.channel")}</legend>
            <div className="flex gap-3">
              <label
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                  channel === "whatsapp"
                    ? "border-gold-500/50 bg-gold-500/10 text-gold-300"
                    : "border-white/10 text-sand-300"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={channel === "whatsapp"}
                  onChange={() => setChannel("whatsapp")}
                  disabled={!contact.whatsapp}
                />
                {t("booking.whatsapp")}
              </label>
              <label
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                  channel === "telegram"
                    ? "border-gold-500/50 bg-gold-500/10 text-gold-300"
                    : "border-white/10 text-sand-300"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={channel === "telegram"}
                  onChange={() => setChannel("telegram")}
                  disabled={!contact.telegram}
                />
                {t("booking.telegram")}
              </label>
            </div>
          </fieldset>

          {price != null && (
            <p className="rounded-lg bg-gold-500/10 px-4 py-3 text-center text-sm text-gold-400">
              {t("booking.priceHint")}: <strong>${price}</strong>
            </p>
          )}

          <p className="text-center text-xs text-sand-500">{t("booking.note")}</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 py-3.5 font-semibold text-ink transition hover:from-gold-400 hover:to-gold-500 disabled:opacity-60"
          >
            {loading ? "…" : t("booking.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-sand-400">{label}</span>
      {children}
    </label>
  );
}
