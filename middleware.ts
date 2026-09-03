import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fallbackLocaleCodes, defaultLocale } from "@/lib/i18n";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const seg = pathname.split("/")[1];
  if (!seg) {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  // Allow known codes; unknown 2-5 letter codes pass (DB may have more)
  if (!/^[a-z]{2,5}$/.test(seg) && !fallbackLocaleCodes.includes(seg)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
