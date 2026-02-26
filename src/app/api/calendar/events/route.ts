import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { calendarEvents } from "@/lib/demo-store";

const createSchema = z.object({
  title: z.string().min(3),
  date: z.string().min(8),
  time: z.string().min(4),
  durationMin: z.number().min(15).max(480),
  assignee: z.string().min(2),
  notifyTelegram: z.boolean().default(false),
  createCrmTask: z.boolean().default(false),
  notes: z.string().optional()
});

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["planned", "done", "canceled"])
});

export async function GET() {
  const session = await getSessionContext();
  const events = calendarEvents.filter((item) => item.workspaceId === session.workspaceId);
  return NextResponse.json({ events, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());
  const event = {
    id: `ce_${Date.now()}`,
    workspaceId: session.workspaceId,
    source: "manual" as const,
    status: "planned" as const,
    ...input
  };
  calendarEvents.unshift(event);
  return NextResponse.json({ event, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}

export async function PATCH(request: Request) {
  const input = updateSchema.parse(await request.json());
  const item = calendarEvents.find((event) => event.id === input.id);
  if (!item) {
    return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
  }
  item.status = input.status;
  return NextResponse.json({ event: item, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
