import { prisma } from "@/lib/db/prisma";
import { deleteDayTrip } from "@/lib/admin/actions";
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

export default async function DayTripsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q, status } = parseListParams(sp);

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      q ? { OR: containsOr(["city", "slug", "title", "duration", "highlights"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.dayTrip.findMany({
      where,
      include: { image: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.dayTrip.count({ where }),
  ]);

  const filterParams = { q: q || undefined, status: status || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kunlik sayohatlar"
        subtitle={`${total} ta sayohat`}
        createHref="/admin/day-trips/new"
        createLabel="Sayohat qo‘shish"
      />

      <ListToolbar
        action="/admin/day-trips"
        q={q}
        searchPlaceholder="Shahar, sarlavha, slug…"
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
          text={q || status ? "Filter bo‘yicha hech narsa topilmadi." : "Hali sayohat yo‘q."}
        />
      ) : (
        <>
          <DataTable columns={["Sarlavha", "Shahar", "Narx", "Holat", ""]}>
            {items.map((d) => {
              const title = parseMap(d.title);
              return (
                <tr key={d.id} className="hover:bg-amber-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">
                      {title.uz || title.en || title.ru || d.slug}
                    </div>
                    <div className="text-[11px] text-zinc-600">{d.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{d.city || "—"}</td>
                  <td className="px-4 py-3 text-zinc-700">${d.price}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/day-trips/${d.id}`}
                      deleteAction={deleteDayTrip}
                      id={d.id}
                    />
                  </td>
                </tr>
              );
            })}
          </DataTable>
          <Pagination
            basePath="/admin/day-trips"
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
