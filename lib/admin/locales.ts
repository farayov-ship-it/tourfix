import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getEnabledLocaleCodes() {
  const locales = await prisma.locale.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });
  return locales.map((l) => l.code);
}
