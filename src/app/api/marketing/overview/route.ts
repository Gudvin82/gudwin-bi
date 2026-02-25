import { NextResponse } from "next/server";
import { buildMarketingOverview } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ overview: buildMarketingOverview(), _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
