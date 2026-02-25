import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { telegramConfigs } from "@/lib/demo-store";

const schema = z.object({
  botToken: z.string().min(20),
  chatId: z.string().min(3)
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const tokenMasked = `${input.botToken.slice(0, 6)}...${input.botToken.slice(-4)}`;
  const record = {
    id: `tg_${Date.now()}`,
    workspaceId: session.workspaceId,
    tokenMasked,
    chatId: input.chatId,
    createdAt: new Date().toISOString(),
    status: "connected" as const
  };

  telegramConfigs.unshift(record);
  return NextResponse.json({ config: record, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}
