import { NextResponse } from "next/server";
import { moneyLeaks } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ leaks: moneyLeaks, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
