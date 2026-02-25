import { NextResponse } from "next/server";
import { agentLogs } from "@/lib/demo-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({
    logs: agentLogs.filter((log) => log.agentId === id).slice(0, 20),
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
