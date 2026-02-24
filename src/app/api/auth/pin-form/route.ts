import { NextRequest, NextResponse } from "next/server";
import { getPortalPin, PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";

export async function POST(req: NextRequest) {
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
  res.cookies.set(PIN_COOKIE_NAME, PIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
  return res;
}
