import { prisma } from "@/lib/db/prisma";
import { deleteCity } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import { parseMap } from "@/components/admin/ui";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
} from "@/components/admin/ListUI";

export default async function CitiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = parseListParams(sp, { extraKeys: ["published", "airport"] });
  const { page, pageSize, skip, q, published, airport } = params as typeof params & {
    published: string;
    airport: string;
  };

  const where = {
    AND: [
      published === "1" ? { published: true } : published === "0" ? { published: false } : {},
      airport === "1" ? { isAirport: true } : airport === "0" ? { isAirport: false } : {},
      q ? { OR: containsOr(["slug", "name"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.city.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.city.count({ where }),
  ]);

  const filterParams = {
    q: q || undefined,
    published: published || undefined,
    airport: airport || undefined,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Shaharlar"
        subtitle={`Bron forma va marshrutlar uchun · ${total} ta`}
        createHref="/admin/cities/new"
        createLabel="Shahar qo‘shish"
      />

      <ListToolbar
        action="/admin/cities"
        q={q}
        searchPlaceholder="Shahar nomi, slug…"
        filters={[
          {
            name: "published",
            label: "Saytda",
            value: published,
            options: [
              { value: "1", label: "Ko‘rinadi" },
              { value: "0", label: "Yashirin" },
            ],
          },
          {
            name: "airport",
            label: "Aeroport",
            value: airport,
            options: [
              { value: "1", label: "Ha" },
              { value: "0", label: "Yo‘q" },
            ],
          },
        ]}
      />

      {total === 0 ? (
        <EmptyState
          text={
            q || published || airport
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Hali shahar yo‘q."
          }
        />
      ) : (
        <>
          <DataTable columns={["Nomi", "Tartib", "Aeroport", "Holat", ""]}>
            {items.map((c) => {
              const name = parseMap(c.name);
              return (
                <tr key={c.id} className="hover:bg-amber-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">
                      {name.uz || name.en || name.ru || c.slug}
                    </div>
                    <div className="text-[11px] text-zinc-600">{c.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{c.sortOrder}</td>
                  <td className="px-4 py-3 text-zinc-700">{c.isAirport ? "Ha" : "Yo‘q"}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {c.published ? "Ko‘rinadi" : "Yashirin"}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/cities/${c.id}`}
                      deleteAction={deleteCity}
                      id={c.id}
                    />
                  </td>
                </tr>
              );
            })}
          </DataTable>
          <Pagination
            basePath="/admin/cities"
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
