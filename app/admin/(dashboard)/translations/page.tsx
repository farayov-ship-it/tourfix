import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteUiCopy } from "@/lib/admin/actions";
import { parseMap, getEnabledLocaleCodes } from "@/components/admin/ui";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
} from "@/components/admin/ListUI";
import Link from "next/link";

function previewText(value: string, locales: string[]) {
  const m = parseMap(value);
  for (const code of locales) {
    const t = m[code]?.trim();
    if (t) return t.length > 60 ? `${t.slice(0, 60)}…` : t;
  }
  return "—";
}

export default async function TranslationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const isOwner = session?.user?.role === "owner";
  const sp = await searchParams;
  const params = parseListParams(sp, { pageSize: 20, extraKeys: ["group"] });
  const { page, pageSize, skip, q, group } = params as typeof params & { group: string };

  const where = {
    AND: [
      group ? { group } : {},
      q ? { OR: containsOr(["key", "group", "value"], q) } : {},
    ],
  };

  const [items, total, locales, groups] = await Promise.all([
    prisma.uiCopy.findMany({
      where,
      orderBy: [{ group: "asc" }, { key: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.uiCopy.count({ where }),
    getEnabledLocaleCodes(),
    prisma.uiCopy.findMany({
      distinct: ["group"],
      select: { group: true },
      orderBy: { group: "asc" },
    }),
  ]);

  const filterParams = { q: q || undefined, group: group || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tarjimalar"
        subtitle={`${total} ta kalit`}
        createHref="/admin/translations/new"
        createLabel="Kalit qo‘shish"
        extra={
          isOwner ? (
            <Link
              href="/admin/translations/tools"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Asboblar (bulk)
            </Link>
          ) : undefined
        }
      />

      <ListToolbar
        action="/admin/translations"
        q={q}
        searchPlaceholder="Kalit, guruh, matn…"
        filters={[
          {
            name: "group",
            label: "Guruh",
            value: group,
            options: groups.map((g) => ({ value: g.group, label: g.group })),
          },
        ]}
      />

      {total === 0 ? (
        <EmptyState
          text={
            q || group
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Tarjima kalitlari yo‘q. «Kalit qo‘shish» tugmasidan boshlang."
          }
        />
      ) : (
        <>
          <DataTable columns={["Kalit", "Guruh", "Ko‘rinish", ""]}>
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3 font-mono text-sm text-zinc-800">{row.key}</td>
                <td className="px-4 py-3 text-zinc-400">{row.group}</td>
                <td className="max-w-xs truncate px-4 py-3 text-zinc-500">
                  {previewText(row.value, locales)}
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/translations/${row.id}`}
                    deleteAction={deleteUiCopy}
                    id={row.id}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/translations"
            page={page}
            total={total}
            pageSize={pageSize}
            params={filterParams}
          />
        </>
      )}
    </div>
  );
}
