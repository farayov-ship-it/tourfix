import { prisma } from "@/lib/db/prisma";
import { deleteVehicle } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import { STATUS_OPTIONS, CATEGORY_OPTIONS, categoryLabel } from "@/components/admin/ui";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
  StatusBadge,
} from "@/components/admin/ListUI";

export default async function VehiclesAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = parseListParams(sp, { extraKeys: ["category"] });
  const { page, pageSize, skip, q, status, category } = params as typeof params & {
    category: string;
  };

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      category ? { category } : {},
      q ? { OR: containsOr(["name", "slug", "category"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: { image: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.vehicle.count({ where }),
  ]);

  const filterParams = {
    q: q || undefined,
    status: status || undefined,
    category: category || undefined,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Avtopark"
        subtitle={`${total} ta avtomobil`}
        createHref="/admin/vehicles/new"
        createLabel="Avtomobil qo‘shish"
      />

      <ListToolbar
        action="/admin/vehicles"
        q={q}
        searchPlaceholder="Nomi, slug…"
        filters={[
          {
            name: "status",
            label: "Holat",
            value: status,
            options: STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
          },
          {
            name: "category",
            label: "Kategoriya",
            value: category,
            options: CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label })),
          },
        ]}
      />

      {total === 0 ? (
        <EmptyState
          text={
            q || status || category
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Hali avtomobil yo‘q."
          }
        />
      ) : (
        <>
          <DataTable columns={["Nomi", "Kategoriya", "O‘rindiq", "Narxdan", "Holat", ""]}>
            {items.map((v) => (
              <tr key={v.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">{v.name}</div>
                  <div className="text-[11px] text-zinc-600">{v.slug}</div>
                </td>
                <td className="px-4 py-3 text-zinc-700">{categoryLabel(v.category)}</td>
                <td className="px-4 py-3 text-zinc-400">{v.capacity}</td>
                <td className="px-4 py-3 text-zinc-700">${v.priceFrom}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/vehicles/${v.id}`}
                    deleteAction={deleteVehicle}
                    id={v.id}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/vehicles"
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
