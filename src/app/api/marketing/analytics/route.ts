import { NextResponse } from "next/server";
import { marketingChannels } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ rows: marketingChannels, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
