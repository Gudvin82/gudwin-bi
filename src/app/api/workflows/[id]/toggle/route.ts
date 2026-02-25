import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";
import { workflows } from "@/lib/demo-store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionContext();
  const { id } = await params;
  const item = workflows.find((workflow) => workflow.id === id && (workflow.workspaceId === session.workspaceId || workflow.workspaceId === "demo"));

  if (!item) {
    return NextResponse.json({ error: "Сценарий не найден" }, { status: 404 });
  }

  item.status = item.status === "active" ? "inactive" : "active";
  item.lastRunAt = new Date().toISOString();

  return NextResponse.json({ workflow: item, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
