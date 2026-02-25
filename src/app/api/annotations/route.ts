import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { annotations } from "@/lib/annotations";

const schema = z.object({
  scope: z.enum(["dashboard", "finance", "marketing", "owner"]),
  title: z.string().min(3),
  note: z.string().min(3)
});

export async function GET() {
  const session = await getSessionContext();
  const items = annotations.filter((item) => item.workspaceId === session.workspaceId || item.workspaceId === "demo");
  return NextResponse.json({ items, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());
  const item = {
    id: `ann_${Date.now()}`,
    workspaceId: session.workspaceId,
    createdAt: new Date().toISOString(),
    ...input
  };
  annotations.unshift(item);
  return NextResponse.json({ item, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
