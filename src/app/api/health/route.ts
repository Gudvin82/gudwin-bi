import { NextResponse } from "next/server";

export async function GET() {
  const aiConnected = Boolean(process.env.AITUNNEL_API_KEY || process.env.OPENAI_API_KEY);
  const provider = process.env.AITUNNEL_API_KEY ? "aitunnel" : process.env.OPENAI_API_KEY ? "openai" : "none";

  return NextResponse.json({
    ok: true,
    service: "gudwin-bi",
    timestamp: new Date().toISOString(),
    ai: {
      connected: aiConnected,
      provider,
      model: process.env.AI_MODEL || "gpt-4.1-mini"
    }
  });
}
