import { NextResponse } from "next/server";
import { buildMarketingOverview } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ overview: buildMarketingOverview() });
}
