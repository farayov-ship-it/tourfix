"use client";

import { useEffect, useMemo, useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { LOCALE_LABELS, PRIMARY_LOCALES } from "./labels";
import { cn } from "@/lib/utils";

const btnGhost =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100";
const btnPrimary =
  "rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50";

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
  const [progress, setProgress] = useState({
    done: 0,
    total: 0,
    current: "",
    ok: 0,
    fail: 0,
  });

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const c of locales) next[c] = values[c] ?? "";
    setMap(next);
  }, [values, locales]);

  const tabs = showAll ? ordered : ordered.filter((c) => PRIMARY_LOCALES.includes(c) || c === active);
  const visibleTabs = tabs.length ? tabs : ordered;
  const emptyCount = ordered.filter((c) => c !== active && !(map[c] || "").trim()).length;
  const pct =
    progress.total > 0 ? Math.min(100, Math.round((progress.done / progress.total) * 100)) : 0;

  async function autoTranslate(mode: "empty" | "all") {
    const sourceLang = active;
    const sourceText = (map[sourceLang] || "").trim();
    if (!sourceText) {
      setMsg("Avval joriy tilga matn yozing");
      return;
    }
    const targets =
      mode === "empty"
        ? ordered.filter((c) => c !== sourceLang && !(map[c] || "").trim())
        : ordered.filter((c) => c !== sourceLang);

    if (!targets.length) {
      setMsg(mode === "empty" ? "Bo‘sh tillar yo‘q — hammasi tarjima qilingan" : "Boshqa tillar yo‘q");
      return;
    }

    setBusy(true);
    setMsg(null);
    setShowAll(true);
    setProgress({ done: 0, total: targets.length, current: "", ok: 0, fail: 0 });

    const next = { ...map };
    let ok = 0;
    let fail = 0;

    for (let i = 0; i < targets.length; i++) {
      const code = targets[i];
      setProgress({ done: i, total: targets.length, current: code, ok, fail });
      setActive(code);

      try {
        const res = await fetch("/api/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: sourceText, from: sourceLang, to: code }),
        });
        const data = (await res.json()) as { translated?: string; error?: string };
        if (!res.ok || !data.translated?.trim()) {
          throw new Error(data.error || "bo‘sh natija");
        }
        next[code] = data.translated.trim();
        ok += 1;
        setMap({ ...next });
      } catch (e) {
        fail += 1;
        setMsg(
          `${LOCALE_LABELS[code] || code}: ${e instanceof Error ? e.message : "tarjima xatosi"}`,
        );
      }

      setProgress({ done: i + 1, total: targets.length, current: code, ok, fail });
    }

    setActive(sourceLang);
    setMsg(
      fail
        ? `${ok} tilga tarjima qilindi, ${fail} ta xato`
        : `${ok} tilga avtomatik tarjima qilindi`,
    );
    setBusy(false);
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
            className={`${btnPrimary} inline-flex items-center gap-1.5`}
            title={`${LOCALE_LABELS[active] || active} dan bo‘sh tillarga (0–100%)`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />}
            Barcha tillarga
            {!busy && emptyCount > 0 ? ` (${emptyCount})` : ""}
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

      {(busy || progress.total > 0) && (
        <div className="space-y-1 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2">
          <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-900">
            <span>
              {busy
                ? `Tarjima: ${LOCALE_LABELS[progress.current] || progress.current || "…"}`
                : "Tarjima yakunlandi"}
            </span>
            <span className="font-semibold tabular-nums">
              {pct}% · {progress.done}/{progress.total}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          {(progress.ok > 0 || progress.fail > 0) && (
            <p className="text-[10px] text-emerald-800/80">
              ok {progress.ok}
              {progress.fail ? ` · xato ${progress.fail}` : ""}
            </p>
          )}
        </div>
      )}

      {msg && !busy && <p className="text-[11px] text-amber-700">{msg}</p>}

      <div className="flex flex-wrap items-center gap-1">
        {visibleTabs.map((code) => {
          const filled = Boolean((map[code] || "").trim());
          const isCurrent = busy && progress.current === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => !busy && setActive(code)}
              disabled={busy}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs transition",
                active === code
                  ? "bg-amber-500 text-zinc-950 font-semibold"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-900",
                isCurrent && "ring-2 ring-emerald-400",
                busy && "cursor-wait opacity-80",
              )}
            >
              {LOCALE_LABELS[code] || code}
              {filled ? "" : " ·"}
              {isCurrent ? " …" : ""}
            </button>
          );
        })}
        {ordered.length > PRIMARY_LOCALES.length && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            disabled={busy}
            className="rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-600 hover:text-amber-700 disabled:opacity-50"
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
              disabled={busy}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-70"
            />
          ) : (
            <input
              name={`${prefix}.${code}`}
              value={map[code] ?? ""}
              onChange={(e) => setMap((m) => ({ ...m, [code]: e.target.value }))}
              placeholder={placeholder}
              disabled={busy}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-70"
            />
          )}
        </div>
      ))}
    </div>
  );
}
