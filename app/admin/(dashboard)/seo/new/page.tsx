import { getEnabledLocaleCodes } from "@/components/admin/ui";
import { SeoForm } from "@/components/admin/forms/SeoForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function NewSeoPage() {
  const locales = await getEnabledLocaleCodes();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi SEO sahifa</h1>
        <BackLink href="/admin/seo" />
      </div>
      <SeoForm locales={locales} />
    </div>
  );
}
