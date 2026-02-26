import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { telegramConfigs } from "@/lib/demo-store";

const schema = z.object({
  botName: z.string().min(3),
  botToken: z.string().min(20),
  groups: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const tokenMasked = `${input.botToken.slice(0, 6)}...${input.botToken.slice(-4)}`;
  const record = {
    id: `tg_${Date.now()}`,
    workspaceId: session.workspaceId,
    botName: input.botName,
    tokenMasked,
    chatId: input.groups[0] ?? "",
    groups: input.groups,
    createdAt: new Date().toISOString(),
    status: "connected" as const
  };

  telegramConfigs.unshift(record);
  return NextResponse.json({
    config: record,
    note: "Бот подключен. Сообщения будут отправляться после включения интеграции.",
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}
