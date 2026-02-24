import { NextResponse } from "next/server";
import { agentLogs } from "@/lib/demo-store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const log = {
    id: crypto.randomUUID(),
    agentId: id,
    timestamp: new Date().toISOString(),
    eventType: "manual_run",
    message: "Задача агента запущена вручную.",
    metadata_json: { initiatedBy: "owner" }
  };

  agentLogs.unshift(log);
  return NextResponse.json({ ok: true, log });
}
