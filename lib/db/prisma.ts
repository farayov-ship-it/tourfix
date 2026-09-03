import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/lib/db/database-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: getDatabaseUrl() },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Vercel warm instance’larida ham bitta client qayta ishlatilsin
globalForPrisma.prisma = prisma;
