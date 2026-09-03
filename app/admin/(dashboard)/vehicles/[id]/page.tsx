import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { VehicleForm } from "@/components/admin/forms/VehicleForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.vehicle.findUnique({
    where: { id },
    include: { image: true },
  });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Avtomobilni tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">{item.name}</p>
        </div>
        <BackLink href="/admin/vehicles" />
      </div>
      <VehicleForm item={item} />
    </div>
  );
}
