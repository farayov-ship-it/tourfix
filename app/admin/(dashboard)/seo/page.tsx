import { prisma } from "@/lib/db/prisma";
import { deleteSeo } from "@/lib/admin/actions";
import { parseMap, getEnabledLocaleCodes } from "@/components/admin/ui";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
} from "@/components/admin/ListUI";

function previewTitle(title: string, locales: string[]) {
  const m = parseMap(title);
  for (const code of locales) {
    const t = m[code]?.trim();
    if (t) return t.length > 50 ? `${t.slice(0, 50)}…` : t;
  }
  return "—";
}

export default async function SeoAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q } = parseListParams(sp, { pageSize: 15 });

  const where = q ? { OR: containsOr(["path", "title", "description"], q) } : {};

  const [items, total, locales] = await Promise.all([
    prisma.seoPage.findMany({
      where,
      orderBy: { path: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.seoPage.count({ where }),
    getEnabledLocaleCodes(),
  ]);

  const filterParams = { q: q || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO"
        subtitle={`${total} ta sahifa`}
        createHref="/admin/seo/new"
        createLabel="SEO qo‘shish"
      />

      <ListToolbar
        action="/admin/seo"
        q={q}
        searchPlaceholder="Path, sarlavha…"
      />

      {total === 0 ? (
        <EmptyState
          text={
            q
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "SEO yozuvlari yo‘q. «SEO qo‘shish» tugmasidan boshlang."
          }
        />
      ) : (
        <>
          <DataTable columns={["Path", "Sarlavha", ""]}>
            {items.map((s) => (
              <tr key={s.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3 font-mono text-sm text-zinc-800">{s.path}</td>
                <td className="max-w-md truncate px-4 py-3 text-zinc-400">
                  {previewTitle(s.title, locales)}
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/seo/${s.id}`}
                    deleteAction={deleteSeo}
                    id={s.id}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/seo"
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
