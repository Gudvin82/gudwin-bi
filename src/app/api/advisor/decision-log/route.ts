import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { decisionLog } from "@/lib/demo-os";

const schema = z.object({
  sessionId: z.string(),
  recommendation: z.string().min(5),
  status: z.enum(["accepted", "rejected", "in_progress"]),
  effect_note: z.string().optional()
});

export async function GET() {
  const session = await getSessionContext();
  return NextResponse.json({
    items: decisionLog.filter((item) => item.workspaceId === session.workspaceId).slice(0, 100),
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const item = {
    id: crypto.randomUUID(),
    workspaceId: session.workspaceId,
    createdAt: new Date().toISOString(),
    ...input
  };

  decisionLog.unshift(item);
  return NextResponse.json({ item, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}
