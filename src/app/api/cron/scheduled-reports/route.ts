import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    executedAt: new Date().toISOString(),
    jobs: [
      { channel: "telegram", status: "queued", type: "daily_summary" },
      { channel: "sms", status: "queued", type: "daily_kpi" }
    ]
  });
}
