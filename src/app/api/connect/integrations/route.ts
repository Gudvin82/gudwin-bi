import { NextResponse } from "next/server";
import { integrations } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ integrations, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
