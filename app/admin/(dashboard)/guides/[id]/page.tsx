import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { GuideForm } from "@/components/admin/forms/GuideForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.guide.findUnique({ where: { id }, include: { image: true } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gidni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">{item.name}</p>
        </div>
        <BackLink href="/admin/guides" />
      </div>
      <GuideForm item={item} locales={locales} />
    </div>
  );
}
