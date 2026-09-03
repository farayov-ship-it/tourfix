import { getEnabledLocaleCodes } from "@/components/admin/ui";
import { UiCopyForm } from "@/components/admin/forms/UiCopyForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function NewTranslationPage() {
  const locales = await getEnabledLocaleCodes();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi tarjima kaliti</h1>
        <BackLink href="/admin/translations" />
      </div>
      <UiCopyForm locales={locales} />
    </div>
  );
}
