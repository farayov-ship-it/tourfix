import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { btnPrimary, btnGhost, statusLabel } from "@/components/admin/ui-styles";
import { DeleteButton } from "@/components/admin/DeleteButton";

export function AdminPageHeader({
  title,
  subtitle,
  createHref,
  createLabel = "Qo‘shish",
  extra,
}: {
  title: string;
  subtitle?: string;
  createHref: string;
  createLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        <Link href={createHref} className={`${btnPrimary} inline-flex items-center gap-2`}>
          <Plus className="h-4 w-4" />
          {createLabel}
        </Link>
      </div>
    </div>
  );
}

export function BackLink({ href, label = "Ro‘yxatga qaytish" }: { href: string; label?: string }) {
  return (
    <Link href={href} className={`${btnGhost} inline-flex`}>
      ← {label}
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "published"
      ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300"
      : status === "draft"
        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
        : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-300";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
      {statusLabel(status)}
    </span>
  );
}

export function RowActions({
  editHref,
  deleteAction,
  id,
}: {
  editHref: string;
  deleteAction?: (formData: FormData) => void | Promise<void>;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link href={editHref} className={btnGhost}>
        Tahrirlash
      </Link>
      {deleteAction && id && <DeleteButton action={deleteAction} id={id} />}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
      {text}
    </div>
  );
}

export function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">{children}</tbody>
      </table>
    </div>
  );
}
