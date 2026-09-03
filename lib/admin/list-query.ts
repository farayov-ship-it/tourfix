/** Admin list: query params helpers */

export const DEFAULT_PAGE_SIZE = 20;

export type SearchParams = Record<string, string | string[] | undefined>;

function one(sp: SearchParams, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export function parseListParams(
  sp: SearchParams,
  opts?: { pageSize?: number; extraKeys?: string[] },
) {
  const pageSize = opts?.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, Number(one(sp, "page")) || 1);
  const q = one(sp, "q").trim();
  const status = one(sp, "status").trim();
  const extras: Record<string, string> = {};
  for (const key of opts?.extraKeys ?? []) {
    extras[key] = one(sp, key).trim();
  }
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    q,
    status,
    ...extras,
  };
}

export function buildListHref(
  basePath: string,
  params: Record<string, string | number | undefined | null>,
  page?: number,
) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === "page") continue;
    if (v === undefined || v === null || v === "") continue;
    u.set(k, String(v));
  }
  const p = page ?? (Number(params.page) || 1);
  if (p > 1) u.set("page", String(p));
  const qs = u.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function totalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Prisma OR contains helpers */
export function containsOr(fields: string[], q: string) {
  if (!q) return undefined;
  return fields.map((field) => ({ [field]: { contains: q } }));
}
