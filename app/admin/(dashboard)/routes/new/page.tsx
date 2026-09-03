import { prisma } from "@/lib/db/prisma";
import { RouteForm } from "@/components/admin/forms/RouteForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function NewRoutePage() {
  const count = await prisma.route.count();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi marshrut</h1>
        <BackLink href="/admin/routes" />
      </div>
      <RouteForm defaultSortOrder={count} />
    </div>
  );
}
