/** TurkUztan production domain & brand contacts */
export const SITE = {
  name: "TurkUztan",
  tagline: "TRAVEL",
  /** Canonical origin (no trailing slash) */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001")
  ).replace(/\/$/, ""),
  domain: "turkuztan.uz",
  email: "hello@turkuztan.uz",
  telegram: "turkuztan_uz",
  instagram: "turkuztan_uz",
  adminEmail: "admin@turkuztan.uz",
  editorEmail: "editor@turkuztan.uz",
} as const;

export function absoluteUrl(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${p}`;
}
