"use client";

import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";

const fieldClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-amber-500";
const labelClass = "text-xs font-medium text-zinc-400";
const btnPrimary =
  "rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50";
const btnGhost =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100";

type Item = {
  id: string;
  key: string;
  value: Record<string, string>;
};

export default function BulkTranslatePanel({
  locales,
  defaultFrom = "en",
}: {
  locales: string[];
  defaultFrom?: string;
}) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState("");
  const [mode, setMode] = useState<"empty" | "overwrite">("empty");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, ok: 0, skip: 0, fail: 0 });

  function pushLog(line: string) {
    setLog((prev) => [line, ...prev].slice(0, 12));
  }

  async function run() {
    if (!to || from === to) {
      pushLog("Manba va maqsad tillarni tanlang");
      return;
    }
    setBusy(true);
    setProgress({ done: 0, total: 0, ok: 0, skip: 0, fail: 0 });
    pushLog("Ro‘yxat yuklanmoqda…");

    try {
      const listRes = await fetch(
        `/api/admin/translate-bulk?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&mode=${mode}`,
      );
      const listData = (await listRes.json()) as { items?: Item[]; error?: string };
      if (!listRes.ok) throw new Error(listData.error || "Ro‘yxat xatosi");

      const items = listData.items || [];
      setProgress((p) => ({ ...p, total: items.length }));
      if (!items.length) {
        pushLog("Tarjima qilinadigan yozuv yo‘q");
        setBusy(false);
        return;
      }

      pushLog(`${items.length} ta yozuv — tarjima boshlandi`);
      let ok = 0;
      let skip = 0;
      let fail = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const source = (item.value[from] || "").trim();
        if (!source) {
          skip += 1;
          setProgress({ done: i + 1, total: items.length, ok, skip, fail });
          continue;
        }
        if (mode === "empty" && (item.value[to] || "").trim()) {
          skip += 1;
          setProgress({ done: i + 1, total: items.length, ok, skip, fail });
          continue;
        }

        try {
          const tr = await fetch("/api/admin/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: source, from, to }),
          });
          const trData = (await tr.json()) as { translated?: string; error?: string };
          if (!tr.ok || !trData.translated?.trim()) {
            throw new Error(trData.error || "bo‘sh natija");
          }

          const save = await fetch("/api/admin/translate-bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: item.id,
              locale: to,
              text: trData.translated,
            }),
          });
          if (!save.ok) {
            const err = (await save.json()) as { error?: string };
            throw new Error(err.error || "saqlash xatosi");
          }
          ok += 1;
          pushLog(`✓ ${item.key}`);
        } catch (e) {
          fail += 1;
          pushLog(`✗ ${item.key}: ${e instanceof Error ? e.message : "xato"}`);
        }
        setProgress({ done: i + 1, total: items.length, ok, skip, fail });
      }

      pushLog(`Tugadi: ${ok} ok, ${skip} o‘tkazildi, ${fail} xato`);
      // soft refresh
      window.location.reload();
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Xato");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-emerald-500/30 bg-white/50 p-5">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-800">
        <Languages className="h-4 w-4" />
        Avtomatik tarjima (UiCopy)
      </h2>
      <p className="mb-4 text-xs text-zinc-500">
        Manba tildan maqsad tilga tarjima. Standart provayder — Google (kalitsiz). Sozlamalardan DeepL/Libre
        tanlash mumkin.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={labelClass}>Qayerdan</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={fieldClass}>
            {locales.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Qayerga</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={fieldClass}>
            <option value="">—</option>
            {locales
              .filter((c) => c !== from)
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Rejim</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "empty" | "overwrite")}
            className={fieldClass}
          >
            <option value="empty">Faqat bo‘shlar</option>
            <option value="overwrite">Hammasini qayta yozish</option>
          </select>
        </div>
        <button type="button" disabled={busy} onClick={run} className={`${btnPrimary} inline-flex items-center gap-2`}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
          Tarjima qilish
        </button>
        {busy && (
          <button type="button" className={btnGhost} disabled>
            {progress.done}/{progress.total}
          </button>
        )}
      </div>

      {progress.total > 0 && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            ok {progress.ok} · o‘tkazildi {progress.skip} · xato {progress.fail}
          </p>
        </div>
      )}

      {log.length > 0 && (
        <ul className="mt-3 max-h-32 space-y-0.5 overflow-y-auto text-[11px] text-zinc-500">
          {log.map((l, i) => (
            <li key={`${i}-${l.slice(0, 20)}`}>{l}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
