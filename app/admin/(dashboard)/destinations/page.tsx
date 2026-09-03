import { prisma } from "@/lib/db/prisma";
import { deleteDestination } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import { parseMap } from "@/components/admin/ui";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
} from "@/components/admin/ListUI";

export default async function DestinationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = parseListParams(sp, { extraKeys: ["published", "featured"] });
  const { page, pageSize, skip, q, published, featured } = params as typeof params & {
    published: string;
    featured: string;
  };

  const where = {
    AND: [
      published === "1" ? { published: true } : published === "0" ? { published: false } : {},
      featured === "1" ? { featured: true } : featured === "0" ? { featured: false } : {},
      q ? { OR: containsOr(["slug", "name", "tagline"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      include: { image: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.destination.count({ where }),
  ]);

  const filterParams = {
    q: q || undefined,
    published: published || undefined,
    featured: featured || undefined,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manzillar"
        subtitle={`${total} ta manzil`}
        createHref="/admin/destinations/new"
        createLabel="Manzil qo‘shish"
      />

      <ListToolbar
        action="/admin/destinations"
        q={q}
        searchPlaceholder="Nomi, slug…"
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
            name: "featured",
            label: "Bosh sahifa",
            value: featured,
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
            q || published || featured
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Hali manzil yo‘q."
          }
        />
      ) : (
        <>
          <DataTable columns={["Nomi", "Tartib", "Bosh sahifa", "Holat", ""]}>
            {items.map((d) => {
              const name = parseMap(d.name);
              return (
                <tr key={d.id} className="hover:bg-amber-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">
                      {name.uz || name.en || name.ru || d.slug}
                    </div>
                    <div className="text-[11px] text-zinc-600">{d.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{d.sortOrder}</td>
                  <td className="px-4 py-3 text-zinc-700">{d.featured ? "Ha" : "Yo‘q"}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {d.published ? "Ko‘rinadi" : "Yashirin"}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/destinations/${d.id}`}
                      deleteAction={deleteDestination}
                      id={d.id}
                    />
                  </td>
                </tr>
              );
            })}
          </DataTable>
          <Pagination
            basePath="/admin/destinations"
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
