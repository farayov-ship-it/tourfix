import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { FaqForm } from "@/components/admin/forms/FaqForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes, parseMap } from "@/components/admin/ui";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.faqItem.findUnique({ where: { id } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();
  const q = parseMap(item.question);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">FAQ tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">{q.uz || q.en || q.ru || "—"}</p>
        </div>
        <BackLink href="/admin/faq" />
      </div>
      <FaqForm item={item} locales={locales} />
    </div>
  );
}
