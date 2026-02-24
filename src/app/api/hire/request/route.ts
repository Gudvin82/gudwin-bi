import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { hireRequests } from "@/lib/demo-store";

const schema = z.object({
  roleType: z.string().min(2),
  rawDescription: z.string().optional()
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const brief = `Нужен ${input.roleType.toLowerCase()} для МСП. Контекст: оборот около 3.9 млн ₽/мес, источники данных: CRM + Google Sheets. Задачи: наладить процессы, снизить потери, дать измеримый KPI-план на 90 дней. ${input.rawDescription ?? ""}`.trim();

  const record = {
    id: crypto.randomUUID(),
    workspaceId: session.workspaceId,
    role_type: input.roleType,
    raw_description: input.rawDescription ?? "",
    ai_generated_brief: brief,
    status: "ready" as const,
    createdAt: new Date().toISOString()
  };
  hireRequests.unshift(record);

  return NextResponse.json({ request: record });
}
