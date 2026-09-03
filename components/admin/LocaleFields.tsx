"use client";

import { useEffect, useMemo, useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { LOCALE_LABELS, PRIMARY_LOCALES } from "./labels";
import { cn } from "@/lib/utils";

const btnGhost =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100";

type Props = {
  prefix: string;
  values: Record<string, string>;
  locales: string[];
  multiline?: boolean;
  label?: string;
  rows?: number;
  placeholder?: string;
};

export default function LocaleFields({
  prefix,
  values,
  locales,
  multiline,
  label,
  rows = 3,
  placeholder,
}: Props) {
  const ordered = useMemo(() => {
    const primary = PRIMARY_LOCALES.filter((c) => locales.includes(c));
    const rest = locales.filter((c) => !PRIMARY_LOCALES.includes(c));
    return [...primary, ...rest];
  }, [locales]);

  const [active, setActive] = useState(ordered[0] || "uz");
  const [showAll, setShowAll] = useState(false);
  const [map, setMap] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const c of locales) init[c] = values[c] ?? "";
    return init;
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const c of locales) next[c] = values[c] ?? "";
    setMap(next);
  }, [values, locales]);

  const tabs = showAll ? ordered : ordered.filter((c) => PRIMARY_LOCALES.includes(c) || c === active);
  const visibleTabs = tabs.length ? tabs : ordered;

  async function autoTranslate(mode: "empty" | "all") {
    const sourceText = (map[active] || "").trim();
    if (!sourceText) {
      setMsg("Avval joriy tilga matn yozing");
      return;
    }
    const targets =
      mode === "empty"
        ? ordered.filter((c) => c !== active && !(map[c] || "").trim())
        : ordered.filter((c) => c !== active);

    if (!targets.length) {
      setMsg(mode === "empty" ? "Bo‘sh tillar yo‘q" : "Boshqa tillar yo‘q");
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          from: active,
          targets,
          fillEmptyOnly: mode === "empty",
          existing: map,
        }),
      });
      const data = (await res.json()) as {
        translations?: Record<string, string>;
        error?: string;
        provider?: string;
      };
      if (!res.ok) throw new Error(data.error || "Tarjima xatosi");

      const next = { ...map };
      let filled = 0;
      for (const [code, text] of Object.entries(data.translations || {})) {
        if (text?.trim()) {
          next[code] = text;
          filled += 1;
        }
      }
      setMap(next);
      setShowAll(true);
      setMsg(
        filled
          ? `${filled} tilga tarjima qilindi (${data.provider || "mt"})`
          : "Tarjima natijasi bo‘sh — provayderni tekshiring",
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Tarjima xatosi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-zinc-200 bg-white/50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label && <p className="text-xs font-medium text-zinc-600">{label}</p>}
        <div className="ml-auto flex flex-wrap gap-1.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => autoTranslate("empty")}
            className={`${btnGhost} inline-flex items-center gap-1.5 disabled:opacity-50`}
            title={`${LOCALE_LABELS[active] || active} dan bo‘sh tillarga`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />}
            Bo‘shlarga tarjima
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (!confirm("Mavjud tarjimalar ustidan yoziladi. Davom etasizmi?")) return;
              autoTranslate("all");
            }}
            className={`${btnGhost} inline-flex items-center gap-1.5 disabled:opacity-50`}
          >
            Qayta tarjima
          </button>
        </div>
      </div>

      {msg && <p className="text-[11px] text-amber-700">{msg}</p>}

      <div className="flex flex-wrap items-center gap-1">
        {visibleTabs.map((code) => {
          const filled = Boolean((map[code] || "").trim());
          return (
            <button
              key={code}
              type="button"
              onClick={() => setActive(code)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs transition",
                active === code
                  ? "bg-amber-500 text-zinc-950 font-semibold"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-900",
              )}
            >
              {LOCALE_LABELS[code] || code}
              {filled ? "" : " ·"}
            </button>
          );
        })}
        {ordered.length > PRIMARY_LOCALES.length && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-600 hover:text-amber-700"
          >
            {showAll ? "Kamroq" : `+${ordered.length - visibleTabs.length} til`}
          </button>
        )}
      </div>

      {ordered.map((code) => (
        <div key={code} className={cn(active === code ? "block" : "hidden")}>
          {multiline ? (
            <textarea
              name={`${prefix}.${code}`}
              value={map[code] ?? ""}
              onChange={(e) => setMap((m) => ({ ...m, [code]: e.target.value }))}
              rows={rows}
              placeholder={placeholder}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
          ) : (
            <input
              name={`${prefix}.${code}`}
              value={map[code] ?? ""}
              onChange={(e) => setMap((m) => ({ ...m, [code]: e.target.value }))}
              placeholder={placeholder}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
}
