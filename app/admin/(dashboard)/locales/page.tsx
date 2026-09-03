import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteLocale } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
} from "@/components/admin/ListUI";

export default async function LocalesAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin");

  const sp = await searchParams;
  const { page, pageSize, skip, q } = parseListParams(sp, { pageSize: 15 });

  const where = q ? { OR: containsOr(["code", "name", "nativeName"], q) } : {};

  const [items, total] = await Promise.all([
    prisma.locale.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.locale.count({ where }),
  ]);

  const filterParams = { q: q || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tillar"
        subtitle={`${total} ta til`}
        createHref="/admin/locales/new"
        createLabel="Til qo‘shish"
      />

      <ListToolbar
        action="/admin/locales"
        q={q}
        searchPlaceholder="Kod, nom…"
      />

      {total === 0 ? (
        <EmptyState
          text={
            q
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Hali til yo‘q. «Til qo‘shish» tugmasidan boshlang."
          }
        />
      ) : (
        <>
          <DataTable columns={["Til", "Kod", "Holat", ""]}>
            {items.map((l) => (
              <tr key={l.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">
                    {l.flag} {l.nativeName || l.name}
                  </div>
                  <div className="text-[11px] text-zinc-600">{l.name}</div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-zinc-400">{l.code}</td>
                <td className="px-4 py-3 text-xs">
                  {l.isDefault && (
                    <span className="mr-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      Asosiy
                    </span>
                  )}
                  {l.enabled ? (
                    <span className="font-semibold text-emerald-700">Faol</span>
                  ) : (
                    <span className="text-zinc-500">O‘chirilgan</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {l.isDefault ? (
                    <RowActions editHref={`/admin/locales/${l.id}`} />
                  ) : (
                    <RowActions
                      editHref={`/admin/locales/${l.id}`}
                      deleteAction={deleteLocale}
                      id={l.id}
                    />
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/locales"
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
