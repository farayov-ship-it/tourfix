import { prisma } from "@/lib/db/prisma";
import { DayTripForm } from "@/components/admin/forms/DayTripForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";

export default async function NewDayTripPage() {
  const [count, locales] = await Promise.all([
    prisma.dayTrip.count(),
    getEnabledLocaleCodes(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi kunlik sayohat</h1>
        <BackLink href="/admin/day-trips" />
      </div>
      <DayTripForm locales={locales} defaultSortOrder={count} />
    </div>
  );
}
