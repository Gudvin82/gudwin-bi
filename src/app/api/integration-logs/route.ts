import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";

export async function GET() {
  const session = await getSessionContext();
  return NextResponse.json({
    workspaceId: session.workspaceId,
    logs: [
      { id: 1, type: "crm_sync", status: "success", createdAt: new Date().toISOString() },
      { id: 2, type: "telegram_send", status: "success", createdAt: new Date().toISOString() }
    ],
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}
