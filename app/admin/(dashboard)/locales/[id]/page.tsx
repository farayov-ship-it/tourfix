import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { LocaleForm } from "@/components/admin/forms/LocaleForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function EditLocalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin");

  const { id } = await params;
  const item = await prisma.locale.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tilni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">{item.code}</p>
        </div>
        <BackLink href="/admin/locales" />
      </div>
      <LocaleForm item={item} />
    </div>
  );
}
