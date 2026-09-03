import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { DestinationForm } from "@/components/admin/forms/DestinationForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes, parseMap } from "@/components/admin/ui";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.destination.findUnique({ where: { id }, include: { image: true } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();
  const name = parseMap(item.name);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manzilni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {name.uz || name.en || name.ru || item.slug}
          </p>
        </div>
        <BackLink href="/admin/destinations" />
      </div>
      <DestinationForm item={item} locales={locales} />
    </div>
  );
}
