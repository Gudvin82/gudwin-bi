import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { yandexDirectConfigs } from "@/lib/demo-store";

const schema = z.object({
  login: z.string().min(2),
  clientId: z.string().min(4),
  token: z.string().min(10)
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());
  const tokenMasked = `${input.token.slice(0, 5)}...${input.token.slice(-4)}`;

  const record = {
    id: `yd_${Date.now()}`,
    workspaceId: session.workspaceId,
    login: input.login,
    clientId: input.clientId,
    tokenMasked,
    createdAt: new Date().toISOString(),
    status: "connected" as const
  };

  yandexDirectConfigs.unshift(record);
  return NextResponse.json({
    config: record,
    note: "Подключение сохранено. Данные появятся после первой синхронизации.",
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
