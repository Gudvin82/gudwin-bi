import { NextResponse } from "next/server";
import { competitorSignals } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ signals: competitorSignals });
}
