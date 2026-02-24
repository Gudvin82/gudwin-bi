import { NextResponse } from "next/server";
import { resolveAiRuntime } from "@/lib/ai/runtime";

export async function GET() {
  const ai = resolveAiRuntime();

  return NextResponse.json({
    ok: true,
    service: "gudwin-bi",
    timestamp: new Date().toISOString(),
    ai: {
      enabled: ai.enabled,
      connected: ai.enabled && ai.hasKey,
      provider: ai.provider,
      model: ai.model
    }
  });
}
