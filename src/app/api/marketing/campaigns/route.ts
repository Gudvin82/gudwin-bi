import { NextResponse } from "next/server";
import { marketingCampaigns } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ campaigns: marketingCampaigns, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
