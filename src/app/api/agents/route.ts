import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { agents } from "@/lib/demo-store";

const schema = z.object({
  type: z.enum(["support", "hr", "sales", "marketing", "custom"]),
  name: z.string().min(3),
  description: z.string().min(6),
  config_json: z.record(z.string(), z.unknown()).default({})
});

export async function GET() {
  const session = await getSessionContext();
  return NextResponse.json({
    agents: agents.filter((a) => a.workspaceId === session.workspaceId || a.workspaceId === "demo"),
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const agent = {
    id: crypto.randomUUID(),
    workspaceId: session.workspaceId,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    ...input
  };
  agents.unshift(agent);

  return NextResponse.json({ agent, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
