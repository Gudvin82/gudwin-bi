import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";

export async function GET() {
  const session = await getSessionContext();
  return NextResponse.json({
    workspaceId: session.workspaceId,
    dashboards: [
      { id: "sales-main", name: "Продажи и выручка", widgets: 8 },
      { id: "ops-main", name: "Операционные метрики", widgets: 4 }
    ]
  });
}
