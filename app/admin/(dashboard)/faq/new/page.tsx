import { prisma } from "@/lib/db/prisma";
import { FaqForm } from "@/components/admin/forms/FaqForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/components/admin/ui";

export default async function NewFaqPage() {
  const [count, locales] = await Promise.all([
    prisma.faqItem.count(),
    getEnabledLocaleCodes(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi savol</h1>
        <BackLink href="/admin/faq" />
      </div>
      <FaqForm locales={locales} defaultSortOrder={count} />
    </div>
  );
}
