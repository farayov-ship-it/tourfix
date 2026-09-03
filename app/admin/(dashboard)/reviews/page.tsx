import { prisma } from "@/lib/db/prisma";
import { deleteReview } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import { STATUS_OPTIONS } from "@/components/admin/ui";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
  StatusBadge,
} from "@/components/admin/ListUI";

export default async function ReviewsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q, status } = parseListParams(sp);

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      q ? { OR: containsOr(["name", "country", "text"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.review.count({ where }),
  ]);

  const filterParams = { q: q || undefined, status: status || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sharhlar"
        subtitle={`${total} ta sharh`}
        createHref="/admin/reviews/new"
        createLabel="Sharh qo‘shish"
      />

      <ListToolbar
        action="/admin/reviews"
        q={q}
        searchPlaceholder="Ism, mamlakat, matn…"
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
          text={q || status ? "Filter bo‘yicha hech narsa topilmadi." : "Hali sharh yo‘q."}
        />
      ) : (
        <>
          <DataTable columns={["Ism", "Mamlakat", "Reyting", "Sana", "Holat", ""]}>
            {items.map((r) => (
              <tr key={r.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3 font-medium text-zinc-900">{r.name}</td>
                <td className="px-4 py-3 text-zinc-700">{r.country || "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{r.rating}/5</td>
                <td className="px-4 py-3 text-zinc-500">{r.date.toISOString().slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/reviews/${r.id}`}
                    deleteAction={deleteReview}
                    id={r.id}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/reviews"
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
