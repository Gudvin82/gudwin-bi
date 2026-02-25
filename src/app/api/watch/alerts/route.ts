import { NextResponse } from "next/server";
import { watchAlerts } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({
    mode: "critical_only",
    briefingTime: "08:00",
    alerts: watchAlerts,
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
