import { NextResponse } from "next/server";
import { computeHealthScore } from "@/lib/demo-os";

export async function GET() {
  const health = computeHealthScore();
  return NextResponse.json({
    health,
    focusOfDay: "Снизить cash risk: закрыть 3 просроченные дебиторки до 18:00.",
    problemOfWeek: "ROMI в marketplace канале ниже целевого порога."
  });
}
