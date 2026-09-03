import { prisma } from "@/lib/db/prisma";
import { ReviewForm } from "@/components/admin/forms/ReviewForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/components/admin/ui";

export default async function NewReviewPage() {
  const [count, locales] = await Promise.all([
    prisma.review.count(),
    getEnabledLocaleCodes(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi sharh</h1>
        <BackLink href="/admin/reviews" />
      </div>
      <ReviewForm locales={locales} defaultSortOrder={count} />
    </div>
  );
}
