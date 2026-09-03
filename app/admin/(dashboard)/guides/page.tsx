import { prisma } from "@/lib/db/prisma";
import { deleteGuide } from "@/lib/admin/actions";
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

export default async function GuidesAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q, status } = parseListParams(sp);

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      q ? { OR: containsOr(["name", "city", "slug", "languages", "specialty"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.guide.findMany({
      where,
      include: { image: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.guide.count({ where }),
  ]);

  const filterParams = { q: q || undefined, status: status || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gidlar"
        subtitle={`${total} ta gid`}
        createHref="/admin/guides/new"
        createLabel="Gid qo‘shish"
      />

      <ListToolbar
        action="/admin/guides"
        q={q}
        searchPlaceholder="Ism, shahar, til…"
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
        <EmptyState text={q || status ? "Filter bo‘yicha hech narsa topilmadi." : "Hali gid yo‘q."} />
      ) : (
        <>
          <DataTable columns={["Ism", "Shahar", "Reyting", "Narx/kun", "Holat", ""]}>
            {items.map((g) => (
              <tr key={g.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">{g.name}</div>
                  <div className="text-[11px] text-zinc-600">{g.slug}</div>
                </td>
                <td className="px-4 py-3 text-zinc-700">{g.city || "—"}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {g.rating} · {g.reviewsCount} sharh
                </td>
                <td className="px-4 py-3 text-zinc-700">${g.pricePerDay}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={g.status} />
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/guides/${g.id}`}
                    deleteAction={deleteGuide}
                    id={g.id}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/guides"
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
