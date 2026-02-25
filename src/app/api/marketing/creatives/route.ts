import { NextResponse } from "next/server";
import { marketingCreatives } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ creatives: marketingCreatives, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
