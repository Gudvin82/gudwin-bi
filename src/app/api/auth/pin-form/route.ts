import { NextRequest, NextResponse } from "next/server";
import { getPortalPin, PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pin = String(formData.get("pin") ?? "").trim();
  const expectedPin = getPortalPin();

  const nextParam = req.nextUrl.searchParams.get("next");
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/owner";

  if (pin !== expectedPin) {
    const location = `/pin?next=${encodeURIComponent(nextPath)}&error=invalid`;
    return NextResponse.redirect(location, { status: 303 });
  }

  const res = NextResponse.redirect(nextPath, { status: 303 });
  res.cookies.set(PIN_COOKIE_NAME, PIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
  return res;
}
