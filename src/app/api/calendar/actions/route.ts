import { NextResponse } from "next/server";
import { z } from "zod";
import { calendarActionLogs, calendarEvents } from "@/lib/demo-store";

const schema = z.object({
  eventId: z.string(),
  action: z.enum(["telegram", "crm_task"])
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const event = calendarEvents.find((item) => item.id === input.eventId);
  if (!event) {
    return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
  }

  const message =
    input.action === "telegram"
      ? `Отправлено уведомление в Telegram по событию «${event.title}».`
      : `Создана задача в CRM по событию «${event.title}».`;

  const log = {
    id: `cal_log_${Date.now()}`,
    eventId: event.id,
    type: input.action,
    message,
    createdAt: new Date().toISOString()
  } as const;

  calendarActionLogs.unshift(log);
  return NextResponse.json({ ok: true, log, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
