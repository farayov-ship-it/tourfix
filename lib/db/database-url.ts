/**
 * Serverless (Vercel) uchun Prisma URL sozlash.
 * connection_limit=1 — har serverless instance bitta ulanish ishlatadi.
 *
 * Eslatma: ba'zi Prisma Postgres instance’larda `pooled.db.prisma.io`
 * TCP orqali ochilmaydi; shunda to‘g‘ridan-to‘g‘ri `db.prisma.io` ishlatiladi.
 */
export function getDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  const normalized = raw.startsWith("postgres://")
    ? raw.replace(/^postgres:\/\//, "postgresql://")
    : raw;

  const parsed = new URL(normalized);

  // Agar ataylab pooled berilgan bo‘lsa — qoldiramiz; aks holda majburan rewrite qilmaymiz
  if (!parsed.searchParams.has("connection_limit")) {
    parsed.searchParams.set("connection_limit", "1");
  }
  if (!parsed.searchParams.has("pool_timeout")) {
    parsed.searchParams.set("pool_timeout", "20");
  }
  if (!parsed.searchParams.has("connect_timeout")) {
    parsed.searchParams.set("connect_timeout", "15");
  }
  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }

  const out = parsed.toString();
  return raw.startsWith("postgres://") ? out.replace(/^postgresql:\/\//, "postgres://") : out;
}
