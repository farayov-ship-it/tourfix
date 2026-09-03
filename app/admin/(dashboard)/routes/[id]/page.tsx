import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { RouteForm } from "@/components/admin/forms/RouteForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function EditRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.route.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Marshrutni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {item.fromName} → {item.toName}
          </p>
        </div>
        <BackLink href="/admin/routes" />
      </div>
      <RouteForm item={item} />
    </div>
  );
}
