import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { CityForm } from "@/components/admin/forms/CityForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";
import { parseMap } from "@/components/admin/ui-styles";

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.city.findUnique({ where: { id } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();
  const name = parseMap(item.name);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Shaharni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {name.uz || name.en || name.ru || item.slug}
          </p>
        </div>
        <BackLink href="/admin/cities" />
      </div>
      <CityForm item={item} locales={locales} />
    </div>
  );
}
