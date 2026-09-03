import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { copyLocaleContent } from "@/lib/admin/actions";
import {
  parseMap,
  fieldClass,
  labelClass,
  btnPrimary,
  getEnabledLocaleCodes,
} from "@/components/admin/ui";
import BulkTranslatePanel from "@/components/admin/BulkTranslatePanel";
import { BackLink } from "@/components/admin/ListUI";

export default async function TranslationToolsPage() {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin/translations");

  const [locales, allForStats] = await Promise.all([
    getEnabledLocaleCodes(),
    prisma.uiCopy.findMany({ select: { value: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tarjima asboblari</h1>
          <p className="mt-1 text-sm text-zinc-500">Bulk avto-tarjima va til nusxalash</p>
        </div>
        <BackLink href="/admin/translations" />
      </div>

      <BulkTranslatePanel locales={locales} defaultFrom="en" />

      <section className="rounded-xl border border-amber-500/30 bg-white/50 p-5">
        <h2 className="mb-3 text-sm font-semibold text-amber-800">
          Til kontentini nusxalash (tarjimasiz)
        </h2>
        <form action={copyLocaleContent} className="flex flex-wrap items-end gap-3">
          <div>
            <label className={labelClass}>Qayerdan</label>
            <select name="from" defaultValue="en" className={fieldClass}>
              {locales.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Qayerga</label>
            <select name="to" className={fieldClass} required>
              <option value="">—</option>
              {locales.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={btnPrimary}>
            Bo‘shlarini nusxalash
          </button>
        </form>
        <p className="mt-3 text-xs text-zinc-500">
          To‘liqlik:{" "}
          {locales
            .map((code) => {
              const filled = allForStats.filter((row) => {
                const m = parseMap(row.value);
                return Boolean(m[code]?.trim());
              }).length;
              const pct = allForStats.length
                ? Math.round((filled / allForStats.length) * 100)
                : 0;
              return `${code} ${pct}%`;
            })
            .join(" · ")}
        </p>
      </section>
    </div>
  );
}
