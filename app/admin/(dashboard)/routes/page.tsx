import { prisma } from "@/lib/db/prisma";
import { deleteRoute } from "@/lib/admin/actions";
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

export default async function RoutesAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q, status } = parseListParams(sp);

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      q
        ? {
            OR: containsOr(["fromName", "toName", "slug", "duration", "distance"], q),
          }
        : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.route.findMany({
      where,
      include: { image: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.route.count({ where }),
  ]);

  const filterParams = { q: q || undefined, status: status || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Marshrutlar"
        subtitle={`${total} ta marshrut`}
        createHref="/admin/routes/new"
        createLabel="Marshrut qo‘shish"
      />

      <ListToolbar
        action="/admin/routes"
        q={q}
        searchPlaceholder="Qayerdan, qayerga, slug…"
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
          text={
            q || status
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Hali marshrut yo‘q. «Marshrut qo‘shish» tugmasidan boshlang."
          }
        />
      ) : (
        <>
          <DataTable columns={["Marshrut", "Narx", "Davomiylik", "Holat", ""]}>
            {items.map((r) => (
              <tr key={r.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">
                    {r.fromName} → {r.toName}
                  </div>
                  <div className="text-[11px] text-zinc-600">{r.slug}</div>
                </td>
                <td className="px-4 py-3 text-zinc-700">${r.price}</td>
                <td className="px-4 py-3 text-zinc-400">{r.duration || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/routes/${r.id}`}
                    deleteAction={deleteRoute}
                    id={r.id}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/routes"
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
