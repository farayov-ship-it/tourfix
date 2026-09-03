import { LocaleForm } from "@/components/admin/forms/LocaleForm";
import { BackLink } from "@/components/admin/ListUI";

export default function NewLocalePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi til</h1>
        <BackLink href="/admin/locales" />
      </div>
      <LocaleForm />
    </div>
  );
}
