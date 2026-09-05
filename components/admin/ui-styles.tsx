import type { ReactNode } from "react";
import { parseLocaleMap } from "@/lib/locale-map";

export function parseMap(raw: string) {
  return parseLocaleMap(raw);
}

export {
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  LOCALE_LABELS,
  statusLabel,
  categoryLabel,
  slugify,
} from "./labels";

export const btnPrimary =
  "rounded-lg bg-[#002040] px-4 py-2 text-sm font-semibold text-white hover:bg-[#001830]";
export const btnDanger =
  "rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50";
export const btnGhost =
  "rounded-lg border border-[#B08040]/40 px-3 py-1.5 text-xs text-[#002040] hover:bg-[#B08040]/10";
export const fieldClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#B08040] focus:ring-2 focus:ring-[#B08040]/20";
export const labelClass = "text-xs font-semibold text-zinc-700";
export const hintClass = "mt-1 text-[11px] font-medium text-zinc-600";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

export function FormCard({
  title,
  children,
  footer,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#002040]/10 bg-white p-4 shadow-sm sm:p-5">
      {title && <h3 className="mb-4 text-sm font-semibold text-[#8f6630]">{title}</h3>}
      {children}
      {footer && <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">{footer}</div>}
    </div>
  );
}
