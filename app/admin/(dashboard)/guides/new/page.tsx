import { prisma } from "@/lib/db/prisma";
import { GuideForm } from "@/components/admin/forms/GuideForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/components/admin/ui";

export default async function NewGuidePage() {
  const [count, locales] = await Promise.all([
    prisma.guide.count(),
    getEnabledLocaleCodes(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi gid</h1>
        <BackLink href="/admin/guides" />
      </div>
      <GuideForm locales={locales} defaultSortOrder={count} />
    </div>
  );
}
