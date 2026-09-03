/**
 * Serverless (Vercel) uchun Prisma Postgres URL ni pooled endpoint ga yo‘naltiradi.
 * To‘g‘ridan-to‘g‘ri `db.prisma.io` ulanishlari tez-tez limitga uriladi va sekin ishlaydi.
 */
export function getDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  let url = raw;

  // Prisma Postgres: ilova trafiki uchun pooled host
  if (url.includes("@db.prisma.io")) {
    url = url.replace("@db.prisma.io", "@pooled.db.prisma.io");
  }

  const normalized = url.startsWith("postgres://")
    ? url.replace(/^postgres:\/\//, "postgresql://")
    : url;

  const parsed = new URL(normalized);

  if (!parsed.searchParams.has("connection_limit")) {
    parsed.searchParams.set("connection_limit", "1");
  }
  if (!parsed.searchParams.has("pool_timeout")) {
    parsed.searchParams.set("pool_timeout", "20");
  }
  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }

  const out = parsed.toString();
  return raw.startsWith("postgres://") ? out.replace(/^postgresql:\/\//, "postgres://") : out;
}
