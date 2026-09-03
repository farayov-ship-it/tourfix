import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteUser } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import {
  AdminPageHeader,
  DataTable,
  EmptyState,
  RowActions,
} from "@/components/admin/ListUI";

export default async function UsersAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin");

  const sp = await searchParams;
  const { page, pageSize, skip, q } = parseListParams(sp, { pageSize: 15 });

  const where = q ? { OR: containsOr(["email", "name"], q) } : {};

  const [items, total] = await Promise.all([
    prisma.adminUser.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.adminUser.count({ where }),
  ]);

  const filterParams = { q: q || undefined };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Foydalanuvchilar"
        subtitle={`${total} ta admin`}
        createHref="/admin/users/new"
        createLabel="Foydalanuvchi qo‘shish"
      />

      <ListToolbar
        action="/admin/users"
        q={q}
        searchPlaceholder="Email, ism…"
      />

      {total === 0 ? (
        <EmptyState
          text={
            q
              ? "Filter bo‘yicha hech narsa topilmadi."
              : "Hali foydalanuvchi yo‘q."
          }
        />
      ) : (
        <>
          <DataTable columns={["Email", "Ism", "Rol", ""]}>
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-amber-50/60">
                <td className="px-4 py-3 text-zinc-800">{u.email}</td>
                <td className="px-4 py-3 text-zinc-400">{u.name || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.role === "owner"
                        ? "font-semibold text-amber-800"
                        : "font-medium text-zinc-700"
                    }
                  >
                    {u.role === "owner" ? "Egasi" : "Muharrir"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.id === session.user?.id ? (
                    <RowActions editHref={`/admin/users/${u.id}`} />
                  ) : (
                    <RowActions
                      editHref={`/admin/users/${u.id}`}
                      deleteAction={deleteUser}
                      id={u.id}
                    />
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination
            basePath="/admin/users"
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
