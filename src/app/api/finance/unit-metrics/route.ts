import { NextResponse } from "next/server";
import { unitMetrics } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ metrics: unitMetrics });
}
