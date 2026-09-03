import { prisma } from "@/lib/db/prisma";
import { VehicleForm } from "@/components/admin/forms/VehicleForm";
import { BackLink } from "@/components/admin/ListUI";

export default async function NewVehiclePage() {
  const count = await prisma.vehicle.count();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi avtomobil</h1>
        <BackLink href="/admin/vehicles" />
      </div>
      <VehicleForm defaultSortOrder={count} />
    </div>
  );
}
