import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { DayTripForm } from "@/components/admin/forms/DayTripForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes, parseMap } from "@/components/admin/ui";

export default async function EditDayTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.dayTrip.findUnique({ where: { id }, include: { image: true } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();
  const title = parseMap(item.title);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sayohatni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {title.uz || title.en || title.ru || item.slug}
          </p>
        </div>
        <BackLink href="/admin/day-trips" />
      </div>
      <DayTripForm item={item} locales={locales} />
    </div>
  );
}
