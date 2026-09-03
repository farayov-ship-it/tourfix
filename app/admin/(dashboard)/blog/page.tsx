import { prisma } from "@/lib/db/prisma";
import { deleteBlogPost } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import { STATUS_OPTIONS, parseMap } from "@/components/admin/ui";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
  StatusBadge,
} from "@/components/admin/ListUI";

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q, status } = parseListParams(sp);

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      q ? { OR: containsOr(["slug", "title", "excerpt", "body"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { cover: true },
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const filterParams = { q: q || undefined, status: status || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        subtitle={`${total} ta maqola`}
        createHref="/admin/blog/new"
        createLabel="Maqola qo‘shish"
      />

      <ListToolbar
        action="/admin/blog"
        q={q}
        searchPlaceholder="Sarlavha, slug, matn…"
        filters={[
          {
            name: "status",
            label: "Holat",
            value: status,
            options: STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
          },
        ]}
      />

      {total === 0 ? (
        <EmptyState
          text={q || status ? "Filter bo‘yicha hech narsa topilmadi." : "Hali maqola yo‘q."}
        />
      ) : (
        <>
          <DataTable columns={["Sarlavha", "Holat", "Yangilangan", ""]}>
            {items.map((p) => {
              const title = parseMap(p.title);
              return (
                <tr key={p.id} className="hover:bg-amber-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">
                      {title.uz || title.en || p.slug}
                    </div>
                    <div className="text-[11px] text-zinc-600">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {p.updatedAt.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/blog/${p.id}`}
                      deleteAction={deleteBlogPost}
                      id={p.id}
                    />
                  </td>
                </tr>
              );
            })}
          </DataTable>
          <Pagination
            basePath="/admin/blog"
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
