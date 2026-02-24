import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalPin, PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";

const bodySchema = z.object({
  pin: z.string().trim().min(1).max(32)
});

export async function POST(req: Request) {
  const body = bodySchema.parse(await req.json());
  const expectedPin = getPortalPin();

  if (body.pin !== expectedPin) {
    return NextResponse.json({ ok: false, error: "Неверный PIN-код." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PIN_COOKIE_NAME, PIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });

  return res;
}
