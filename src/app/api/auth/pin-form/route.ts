import { NextRequest, NextResponse } from "next/server";
import { getPortalPin, PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pin = String(formData.get("pin") ?? "").trim();
  const expectedPin = getPortalPin();

  const nextParam = req.nextUrl.searchParams.get("next");
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/owner";
  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "http";
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : req.nextUrl.origin;

  if (pin !== expectedPin) {
    const errorUrl = new URL("/pin", origin);
    errorUrl.searchParams.set("next", nextPath);
    errorUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  const successUrl = new URL(nextPath, origin);
  const res = NextResponse.redirect(successUrl, { status: 303 });
  res.cookies.set(PIN_COOKIE_NAME, PIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
  return res;
}
