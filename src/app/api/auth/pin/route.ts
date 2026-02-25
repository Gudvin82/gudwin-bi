import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalPin } from "@/lib/auth/pin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { SESSION_COOKIE_NAME, getSessionCookieOptions, signSession } from "@/lib/auth/session-cookie";

const bodySchema = z.object({
  pin: z.string().trim().min(1).max(32)
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`pin:${ip}`, 6, 10 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Слишком много попыток. Попробуйте позже." },
      { status: 429 }
    );
  }

  const body = bodySchema.parse(await req.json());
  const expectedPin = getPortalPin();

  if (body.pin !== expectedPin) {
    return NextResponse.json({ ok: false, error: "Неверный PIN-код." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const sessionValue = signSession({
    userId: "00000000-0000-0000-0000-000000000001",
    workspaceId: process.env.DEFAULT_WORKSPACE_ID ?? "00000000-0000-0000-0000-000000000001",
    role: "owner",
    issuedAt: Date.now()
  });
  if (!sessionValue) {
    return NextResponse.json({ ok: false, error: "Ошибка конфигурации сессии." }, { status: 500 });
  }
  res.cookies.set(SESSION_COOKIE_NAME, sessionValue, getSessionCookieOptions());

  return res;
}
