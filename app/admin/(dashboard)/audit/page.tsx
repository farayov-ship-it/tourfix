import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";

export default async function AuditAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin");

  const sp = await searchParams;
  const params = parseListParams(sp, { pageSize: 30, extraKeys: ["entity", "action"] });
  const { page, pageSize, skip, q, entity, action } = params as typeof params & {
    entity: string;
    action: string;
  };

  const where = {
    AND: [
      entity ? { entity: { contains: entity } } : {},
      action ? { action: { contains: action } } : {},
      q
        ? {
            OR: [
              ...containsOr(["action", "entity", "entityId"], q)!,
              { user: { email: { contains: q } } },
            ],
          }
        : {},
    ],
  };

  const [logs, total, entities] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { user: { select: { email: true } } },
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      distinct: ["entity"],
      select: { entity: true },
      orderBy: { entity: "asc" },
      take: 50,
    }),
  ]);

  const filterParams = {
    q: q || undefined,
    entity: entity || undefined,
    action: action || undefined,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit</h1>
        <p className="mt-1 text-sm text-zinc-500">{total} ta log</p>
      </div>

      <ListToolbar
        action="/admin/audit"
        q={q}
        searchPlaceholder="Action, entity, email…"
        filters={[
          {
            name: "entity",
            label: "Entity",
            value: entity,
            options: entities.map((e) => ({ value: e.entity, label: e.entity })),
          },
          {
            name: "action",
            label: "Action",
            value: action,
            options: [
              { value: "create", label: "create" },
              { value: "update", label: "update" },
              { value: "delete", label: "delete" },
            ],
          },
        ]}
      />

      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-white text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Vaqt</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Entity</th>
              <th className="px-3 py-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-zinc-100">
                <td className="whitespace-nowrap px-3 py-2 text-xs text-zinc-500">
                  {log.createdAt.toISOString().slice(0, 19).replace("T", " ")}
                </td>
                <td className="px-3 py-2 text-xs">{log.user?.email ?? "—"}</td>
                <td className="px-3 py-2">{log.action}</td>
                <td className="px-3 py-2">{log.entity}</td>
                <td className="max-w-[140px] truncate px-3 py-2 font-mono text-xs text-zinc-500">
                  {log.entityId ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <p className="p-4 text-sm text-zinc-500">Loglar yo‘q.</p>
        )}
      </div>

      <Pagination
        basePath="/admin/audit"
        page={page}
        total={total}
        pageSize={pageSize}
        params={filterParams}
      />
    </div>
  );
}
