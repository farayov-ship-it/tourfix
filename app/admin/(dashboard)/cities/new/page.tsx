import { prisma } from "@/lib/db/prisma";
import { CityForm } from "@/components/admin/forms/CityForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";

export default async function NewCityPage() {
  const [count, locales] = await Promise.all([
    prisma.city.count(),
    getEnabledLocaleCodes(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi shahar</h1>
        <BackLink href="/admin/cities" />
      </div>
      <CityForm locales={locales} defaultSortOrder={count} />
    </div>
  );
}
