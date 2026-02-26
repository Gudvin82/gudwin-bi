import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { getConnector } from "@/lib/connectors";
import type { DataSourceType } from "@/lib/connectors/types";
import { proposeDashboard } from "@/lib/dashboard/auto-dashboard";
import { uid } from "@/lib/utils/uid";

const createSchema = z.object({
  type: z.enum(["google_sheets", "google_drive", "excel_upload", "word_upload", "bitrix24", "moysklad", "custom_api", "webhook"]),
  config: z.record(z.string(), z.unknown())
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());
  const connector = getConnector(input.type as DataSourceType);
  const config = { ...input.config };
  if (input.type === "google_sheets") {
    config.workspaceId = session.workspaceId;
    if (!("authMode" in config)) {
      config.authMode = "public";
    }
  }

  await connector.validateConfig(config);
  const synced = await connector.sync(config);
  const autoDashboard = proposeDashboard(synced.schema);

  return NextResponse.json({
    workspaceId: session.workspaceId,
    syncJob: {
      jobId: uid("sync"),
      status: "queued",
      note: "Источник поставлен в очередь фоновой синхронизации."
    },
    dataset: {
      name: `${input.type}_dataset`,
      rowCount: synced.rows,
      schema: synced.schema
    },
    autoDashboard,
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}
