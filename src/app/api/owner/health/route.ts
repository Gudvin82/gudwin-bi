import { NextResponse } from "next/server";
import { computeHealthScore } from "@/lib/demo-os";

export async function GET() {
  const health = computeHealthScore();
  return NextResponse.json({
    health,
    focusOfDay: "",
    problemOfWeek: "",
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}
