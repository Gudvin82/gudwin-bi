import { NextResponse } from "next/server";
import { buildAnalyticPlan } from "@/lib/ai/provider";

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const data = await request.json();
  const webhookSecret = request.headers.get("x-telegram-secret");

  if (process.env.TELEGRAM_WEBHOOK_SECRET && process.env.TELEGRAM_WEBHOOK_SECRET !== webhookSecret) {
    return NextResponse.json({ ok: false, error: "Invalid webhook secret" }, { status: 401 });
  }

  const { workspaceId } = await params;
  const message = data?.message?.text ?? "";
  const plan = await buildAnalyticPlan(message || "Сделай сводку за сегодня", `workspace=${workspaceId}; sales(date,revenue,channel)`);

  return NextResponse.json({ ok: true, reply: plan.summary, sql: plan.sql });
}
