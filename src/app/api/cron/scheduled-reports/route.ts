import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET не задан." }, { status: 500 });
  }
  if (secret) {
    const authHeader = req.headers.get("authorization") ?? req.headers.get("x-cron-secret") ?? "";
    const isValid = authHeader === `Bearer ${secret}` || authHeader === secret;
    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.json({
    ok: true,
    executedAt: new Date().toISOString(),
    jobs: [
      { channel: "telegram", status: "queued", type: "daily_summary" },
      { channel: "sms", status: "queued", type: "daily_kpi" }
    ]
  });
}
