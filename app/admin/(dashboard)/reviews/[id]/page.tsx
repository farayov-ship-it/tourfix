import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ReviewForm } from "@/components/admin/forms/ReviewForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/components/admin/ui";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, locales] = await Promise.all([
    prisma.review.findUnique({ where: { id } }),
    getEnabledLocaleCodes(),
  ]);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sharhni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {item.name} · {item.country}
          </p>
        </div>
        <BackLink href="/admin/reviews" />
      </div>
      <ReviewForm item={item} locales={locales} />
    </div>
  );
}
