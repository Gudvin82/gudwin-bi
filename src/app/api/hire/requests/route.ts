import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";
import { hireRequests } from "@/lib/demo-store";

export async function GET() {
  const session = await getSessionContext();
  return NextResponse.json({
    requests: hireRequests.filter((r) => r.workspaceId === session.workspaceId),
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
