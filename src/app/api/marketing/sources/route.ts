import { NextResponse } from "next/server";
import { marketingSources } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ sources: marketingSources, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}
