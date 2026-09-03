import { prisma } from "@/lib/db/prisma";
import { deleteFaq } from "@/lib/admin/actions";
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

export default async function FaqAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize, skip, q, status } = parseListParams(sp);

  const where = {
    AND: [
      status ? { status: status as "draft" | "published" | "archived" } : {},
      q ? { OR: containsOr(["question", "answer"], q) } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.faqItem.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.faqItem.count({ where }),
  ]);

  const filterParams = { q: q || undefined, status: status || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQ"
        subtitle={`${total} ta savol`}
        createHref="/admin/faq/new"
        createLabel="Savol qo‘shish"
      />

      <ListToolbar
        action="/admin/faq"
        q={q}
        searchPlaceholder="Savol yoki javob…"
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
          text={q || status ? "Filter bo‘yicha hech narsa topilmadi." : "Hali savol yo‘q."}
        />
      ) : (
        <>
          <DataTable columns={["Savol", "Tartib", "Holat", ""]}>
            {items.map((f) => {
              const question = parseMap(f.question);
              return (
                <tr key={f.id} className="hover:bg-amber-50/60">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {question.uz || question.en || question.ru || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{f.sortOrder}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      editHref={`/admin/faq/${f.id}`}
                      deleteAction={deleteFaq}
                      id={f.id}
                    />
                  </td>
                </tr>
              );
            })}
          </DataTable>
          <Pagination
            basePath="/admin/faq"
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
