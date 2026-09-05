"use client";

import { useEffect, useRef, useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { LOCALE_LABELS } from "./labels";

const fieldClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-amber-500";
const labelClass = "text-xs font-medium text-zinc-500";

type Job = {
  id: string;
  key: string;
  locale: string;
  text: string;
};

export default function TranslateAllEmptyPanel({
  locales,
  defaultFrom = "en",
  emptySlots = 0,
}: {
  locales: string[];
  defaultFrom?: string;
  emptySlots?: number;
}) {
  const preferred = locales.includes(defaultFrom)
    ? defaultFrom
    : locales.includes("en")
      ? "en"
      : locales[0] || "en";

  const [from, setFrom] = useState(preferred);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({
    done: 0,
    total: 0,
    ok: 0,
    fail: 0,
    currentKey: "",
    currentLocale: "",
  });
  const cancelRef = useRef(false);

  const pct =
    progress.total > 0 ? Math.min(100, Math.round((progress.done / progress.total) * 100)) : 0;

  useEffect(() => {
    if (!busy) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy]);

  function pushLog(line: string) {
    setLog((prev) => [line, ...prev].slice(0, 20));
  }

  async function run() {
    if (busy) return;
    if (
      !confirm(
        "Barcha kalitlardagi bo‘sh tillar avtomatik tarjima qilinadi. Bu uzoq davom etishi mumkin — sahifani yopmang. Davom etasizmi?",
      )
    ) {
      return;
    }

    cancelRef.current = false;
    setBusy(true);
    setLog([]);
    setProgress({
      done: 0,
      total: 0,
      ok: 0,
      fail: 0,
      currentKey: "",
      currentLocale: "",
    });
    pushLog("Bo‘sh tarjimalar ro‘yxati yuklanmoqda…");

    try {
      const listRes = await fetch(
        `/api/admin/translate-bulk?from=${encodeURIComponent(from)}&allTargets=1&mode=empty`,
      );
      const listData = (await listRes.json()) as {
        jobs?: Job[];
        targets?: string[];
        error?: string;
      };
      if (!listRes.ok) throw new Error(listData.error || "Ro‘yxat xatosi");

      const jobs = listData.jobs || [];
      if (!jobs.length) {
        pushLog("Tarjima qilinadigan bo‘sh joy yo‘q — hammasi to‘liq");
        setBusy(false);
        return;
      }

      pushLog(
        `${jobs.length} ta bo‘sh tarjima · ${listData.targets?.length || 0} til — boshlandi`,
      );
      setProgress((p) => ({ ...p, total: jobs.length }));

      let ok = 0;
      let fail = 0;

      for (let i = 0; i < jobs.length; i++) {
        if (cancelRef.current) {
          pushLog(`To‘xtatildi: ${ok} ok, ${fail} xato · ${i}/${jobs.length}`);
          break;
        }

        const job = jobs[i];
        setProgress({
          done: i,
          total: jobs.length,
          ok,
          fail,
          currentKey: job.key,
          currentLocale: job.locale,
        });

        try {
          const tr = await fetch("/api/admin/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: job.text, from, to: job.locale }),
          });
          const trData = (await tr.json()) as { translated?: string; error?: string };
          if (!tr.ok || !trData.translated?.trim()) {
            throw new Error(trData.error || "bo‘sh natija");
          }

          const save = await fetch("/api/admin/translate-bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: job.id,
              locale: job.locale,
              text: trData.translated.trim(),
            }),
          });
          if (!save.ok) {
            const err = (await save.json()) as { error?: string };
            throw new Error(err.error || "saqlash xatosi");
          }

          ok += 1;
          if (ok % 5 === 0 || i === jobs.length - 1) {
            pushLog(`✓ ${job.key} → ${job.locale}`);
          }
        } catch (e) {
          fail += 1;
          pushLog(
            `✗ ${job.key} → ${job.locale}: ${e instanceof Error ? e.message : "xato"}`,
          );
        }

        setProgress({
          done: i + 1,
          total: jobs.length,
          ok,
          fail,
          currentKey: job.key,
          currentLocale: job.locale,
        });
      }

      if (!cancelRef.current) {
        pushLog(`Tugadi: ${ok} ok, ${fail} xato (100%)`);
        await new Promise((r) => setTimeout(r, 800));
        window.location.reload();
      }
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Xato");
    } finally {
      setBusy(false);
    }
  }

  function stop() {
    cancelRef.current = true;
    pushLog("To‘xtatish so‘raldi… joriy qadamdan keyin to‘xtaydi");
  }

  return (
    <section className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <Languages className="h-4 w-4" />
            Barcha bo‘shlarni avtomatik tarjima
          </h2>
          <p className="mt-1 max-w-xl text-xs text-zinc-500">
            Manba tildan barcha yoqilgan tillarga bo‘sh joylarni birma-bir to‘ldiradi. Uzoq
            davom etishi mumkin — sahifani ochiq qoldiring. Progress 0–100% ko‘rsatiladi.
            {emptySlots > 0 ? (
              <>
                {" "}
                Taxminan <strong className="text-emerald-800">{emptySlots}</strong> ta bo‘sh joy.
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[140px]">
          <label className={labelClass}>Manba til</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            disabled={busy}
            className={fieldClass}
          >
            {locales.map((c) => (
              <option key={c} value={c}>
                {LOCALE_LABELS[c] || c} ({c})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={run}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
          {busy ? `Tarjima… ${pct}%` : "Barcha bo‘shlarni tarjima qilish"}
        </button>

        {busy && (
          <button
            type="button"
            onClick={stop}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100"
          >
            To‘xtatish
          </button>
        )}
      </div>

      {(busy || progress.total > 0) && (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
            <span className="truncate">
              {busy && progress.currentKey
                ? `${progress.currentKey} → ${LOCALE_LABELS[progress.currentLocale] || progress.currentLocale}`
                : busy
                  ? "Tayyorlanmoqda…"
                  : "Yakunlandi"}
            </span>
            <span className="shrink-0 font-semibold tabular-nums">
              {pct}% · {progress.done}/{progress.total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            ok {progress.ok}
            {progress.fail ? ` · xato ${progress.fail}` : ""}
          </p>
        </div>
      )}

      {log.length > 0 && (
        <ul className="mt-3 max-h-36 space-y-0.5 overflow-y-auto rounded-lg bg-white/70 px-3 py-2 text-[11px] text-zinc-600">
          {log.map((l, i) => (
            <li key={`${i}-${l.slice(0, 24)}`}>{l}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
