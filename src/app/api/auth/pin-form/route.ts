import { NextRequest, NextResponse } from "next/server";
import { getPortalPin } from "@/lib/auth/pin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { SESSION_COOKIE_NAME, getSessionCookieOptions, signSession } from "@/lib/auth/session-cookie";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`pin:${ip}`, 6, 10 * 60_000);
  if (!limit.allowed) {
    const errorUrl = req.nextUrl.clone();
    errorUrl.pathname = "/pin";
    errorUrl.search = "";
    errorUrl.searchParams.set("error", "rate");
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  const formData = await req.formData();
  const pin = String(formData.get("pin") ?? "").trim();
  const expectedPin = getPortalPin();

  const nextParam = req.nextUrl.searchParams.get("next");
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/owner";

  if (pin !== expectedPin) {
    const errorUrl = req.nextUrl.clone();
    errorUrl.pathname = "/pin";
    errorUrl.search = "";
    errorUrl.searchParams.set("next", nextPath);
    errorUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  const successUrl = req.nextUrl.clone();
  successUrl.pathname = nextPath;
  successUrl.search = "";
  const res = NextResponse.redirect(successUrl, { status: 303 });
  const sessionValue = signSession({
    userId: "00000000-0000-0000-0000-000000000001",
    workspaceId: process.env.DEFAULT_WORKSPACE_ID ?? "00000000-0000-0000-0000-000000000001",
    role: "owner",
    issuedAt: Date.now()
  });
  if (!sessionValue) {
    const failUrl = req.nextUrl.clone();
    failUrl.pathname = "/pin";
    failUrl.search = "";
    failUrl.searchParams.set("error", "config");
    return NextResponse.redirect(failUrl, { status: 303 });
  }
  res.cookies.set(SESSION_COOKIE_NAME, sessionValue, getSessionCookieOptions());
  return res;
}
