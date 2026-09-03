import Link from "next/link";
import { Search, X } from "lucide-react";
import { fieldClass, btnGhost, btnPrimary } from "@/components/admin/ui";
import { buildListHref } from "@/lib/admin/list-query";

export type FilterOption = { value: string; label: string };

export type ListFilterField = {
  name: string;
  label: string;
  options: FilterOption[];
  value?: string;
};

export function ListToolbar({
  action,
  q = "",
  searchPlaceholder = "Qidirish…",
  filters = [],
  extraHidden,
}: {
  action: string;
  q?: string;
  searchPlaceholder?: string;
  filters?: ListFilterField[];
  /** Keep other query keys if needed */
  extraHidden?: Record<string, string>;
}) {
  const hasActive =
    Boolean(q) || filters.some((f) => Boolean(f.value)) || Boolean(extraHidden && Object.values(extraHidden).some(Boolean));

  return (
    <form
      method="get"
      action={action}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div className="min-w-[200px] flex-1">
        <label className="text-xs font-medium text-zinc-600">Qidiruv</label>
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder={searchPlaceholder}
            className={`${fieldClass} !mt-0 pl-9`}
          />
        </div>
      </div>

      {filters.map((f) => (
        <div key={f.name} className="w-full sm:w-40">
          <label className="text-xs font-medium text-zinc-600">{f.label}</label>
          <select name={f.name} defaultValue={f.value || ""} className={fieldClass}>
            <option value="">Hammasi</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {extraHidden &&
        Object.entries(extraHidden).map(([k, v]) =>
          v ? <input key={k} type="hidden" name={k} value={v} /> : null,
        )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={btnPrimary}>
          Filtrlash
        </button>
        {hasActive && (
          <Link href={action} className={`${btnGhost} inline-flex items-center gap-1`}>
            <X className="h-3.5 w-3.5" />
            Tozalash
          </Link>
        )}
      </div>
    </form>
  );
}

export function Pagination({
  basePath,
  page,
  total,
  pageSize,
  params,
}: {
  basePath: string;
  page: number;
  total: number;
  pageSize: number;
  params: Record<string, string | undefined>;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const nums = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
      <p>
        <span className="font-medium text-zinc-800">{from}–{to}</span> / {total} ta
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <Link
          href={buildListHref(basePath, params, Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={`${btnGhost} ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
        >
          ← Oldingi
        </Link>
        {nums.map((n) => (
          <Link
            key={n}
            href={buildListHref(basePath, params, n)}
            className={
              n === page
                ? "rounded-lg bg-[#B08040] px-3 py-1.5 text-xs font-semibold text-[#001830]"
                : btnGhost
            }
          >
            {n}
          </Link>
        ))}
        <Link
          href={buildListHref(basePath, params, Math.min(pages, page + 1))}
          aria-disabled={page >= pages}
          className={`${btnGhost} ${page >= pages ? "pointer-events-none opacity-40" : ""}`}
        >
          Keyingi →
        </Link>
      </div>
    </div>
  );
}
