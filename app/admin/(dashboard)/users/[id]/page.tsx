import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { UserForm } from "@/components/admin/forms/UserForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "owner") redirect("/admin");

  const { id } = await params;
  const item = await prisma.adminUser.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Foydalanuvchini tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">{item.email}</p>
        </div>
        <BackLink href="/admin/users" />
      </div>
      <UserForm item={item} />
    </div>
  );
}
