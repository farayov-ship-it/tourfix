import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";
import { SeoForm } from "@/components/admin/forms/SeoForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function EditSeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.seoPage.findUnique({ where: { id } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">SEO tahrirlash</h1>
          <p className="mt-1 font-mono text-sm text-zinc-500">{item.path}</p>
        </div>
        <BackLink href="/admin/seo" />
      </div>
      <SeoForm item={item} locales={locales} />
    </div>
  );
}
