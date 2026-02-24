import { NextRequest, NextResponse } from "next/server";
import { PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";

const PUBLIC_PATHS = ["/pin"];

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicAsset(pathname) || PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const cookieValue = req.cookies.get(PIN_COOKIE_NAME)?.value;
  if (cookieValue === PIN_COOKIE_VALUE) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/pin", req.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
