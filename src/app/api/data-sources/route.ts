import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { getConnector } from "@/lib/connectors";
import type { DataSourceType } from "@/lib/connectors/types";
import { proposeDashboard } from "@/lib/dashboard/auto-dashboard";

const createSchema = z.object({
  type: z.enum(["google_sheets", "google_drive", "excel_upload", "word_upload", "bitrix24", "moysklad", "custom_api", "webhook"]),
  config: z.record(z.string(), z.unknown())
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());
  const connector = getConnector(input.type as DataSourceType);

  await connector.validateConfig(input.config);
  const synced = await connector.sync(input.config);
  const autoDashboard = proposeDashboard(synced.schema);

  return NextResponse.json({
    workspaceId: session.workspaceId,
    dataset: {
      name: `${input.type}_dataset`,
      rowCount: synced.rows,
      schema: synced.schema
    },
    autoDashboard
  });
}
