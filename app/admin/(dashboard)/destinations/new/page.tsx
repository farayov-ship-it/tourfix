import { prisma } from "@/lib/db/prisma";
import { DestinationForm } from "@/components/admin/forms/DestinationForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";

export default async function NewDestinationPage() {
  const [count, locales] = await Promise.all([
    prisma.destination.count(),
    getEnabledLocaleCodes(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi manzil</h1>
        <BackLink href="/admin/destinations" />
      </div>
      <DestinationForm locales={locales} defaultSortOrder={count} />
    </div>
  );
}
