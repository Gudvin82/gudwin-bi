import { NextResponse } from "next/server";
import { buildMarketingOverview, marketingChannels } from "@/lib/demo-os";

export async function GET() {
  const overview = marketingChannels.length ? buildMarketingOverview() : null;
  return NextResponse.json({ overview, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
