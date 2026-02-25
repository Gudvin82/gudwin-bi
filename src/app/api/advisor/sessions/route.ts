import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { advisorSessions } from "@/lib/demo-store";

const schema = z.object({
  role: z.enum(["business", "accountant", "financier"]),
  title: z.string().min(3)
});

export async function GET() {
  const session = await getSessionContext();
  const data = advisorSessions.filter((item) => item.workspaceId === session.workspaceId || item.workspaceId === "demo");
  return NextResponse.json({ sessions: data, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const record = {
    id: crypto.randomUUID(),
    workspaceId: session.workspaceId,
    createdAt: new Date().toISOString(),
    ...input
  };
  advisorSessions.unshift(record);

  return NextResponse.json({ session: record, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
