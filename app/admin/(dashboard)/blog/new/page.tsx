import { BlogForm } from "@/components/admin/forms/BlogForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";

export default async function NewBlogPage() {
  const locales = await getEnabledLocaleCodes();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi maqola</h1>
        <BackLink href="/admin/blog" />
      </div>
      <BlogForm locales={locales} />
    </div>
  );
}
