"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MessageCircle, Plus, Send, SquareCheckBig } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMin: number;
  assignee: string;
  source: "manual" | "bitrix24" | "amocrm" | "google_calendar";
  status: "planned" | "done" | "canceled";
  notifyTelegram: boolean;
  createCrmTask: boolean;
  notes?: string;
};

type CalendarActionLog = {
  id: string;
  eventId: string;
  type: "telegram" | "crm_task";
  message: string;
  createdAt: string;
};

const sourceLabel: Record<CalendarEvent["source"], string> = {
  manual: "Вручную",
  bitrix24: "Bitrix24",
  amocrm: "amoCRM",
  google_calendar: "Google Calendar"
};

const statusLabel: Record<CalendarEvent["status"], string> = {
  planned: "Запланировано",
  done: "Выполнено",
  canceled: "Отменено"
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [logs, setLogs] = useState<CalendarActionLog[]>([]);
  const [title, setTitle] = useState("Встреча по продажам");
  const [date, setDate] = useState("2026-02-28");
  const [time, setTime] = useState("12:00");
  const [durationMin, setDurationMin] = useState(45);
  const [assignee, setAssignee] = useState("Владелец");
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [createCrmTask, setCreateCrmTask] = useState(true);
  const [notes, setNotes] = useState("Проверить воронку и план на неделю.");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/calendar/events");
    const json = (await res.json()) as { events: CalendarEvent[] };
    setEvents(json.events ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const createEvent = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          time,
          durationMin,
          assignee,
          notifyTelegram,
          createCrmTask,
          notes
        })
      });
      const json = (await res.json()) as { event?: CalendarEvent };
      if (json.event && notifyTelegram) {
        await runAction(json.event.id, "telegram");
      }
      if (json.event && createCrmTask) {
        await runAction(json.event.id, "crm_task");
      }
      await load();
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (eventId: string, action: "telegram" | "crm_task") => {
    const res = await fetch("/api/calendar/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, action })
    });
    const json = (await res.json()) as { log?: CalendarActionLog };
    const log = json.log;
    if (!log) return;
    setLogs((prev) => [log, ...prev]);
  };

  const updateStatus = async (id: string, status: CalendarEvent["status"]) => {
    await fetch("/api/calendar/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    await load();
  };

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const item of events) {
      const key = item.date;
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Календарь</h2>
            <p className="mt-1 text-sm text-muted">Планирование встреч и расписаний с уведомлениями в Telegram и запуском задач в CRM.</p>
          </div>
          <HelpPopover
            title="Как использовать"
            items={[
              "Создайте встречу справа.",
              "Включите уведомление в Telegram и/или задачу в CRM.",
              "Отмечайте статус события по факту."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <CalendarDays size={16} />
            Расписание встреч
          </h3>
          <div className="space-y-4">
            {grouped.map(([day, dayEvents]) => (
              <div key={day} className="rounded-xl border border-slate-200 p-3">
                <p className="mb-2 text-sm font-semibold">{new Date(day).toLocaleDateString("ru-RU", { weekday: "long", day: "2-digit", month: "long" })}</p>
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border border-slate-200 bg-white p-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{event.time} • {event.title}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{statusLabel[event.status]}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {event.durationMin} мин • {event.assignee} • {sourceLabel[event.source]}
                      </p>
                      {event.notes ? <p className="mt-1 text-xs text-slate-600">{event.notes}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => runAction(event.id, "telegram")}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold"
                        >
                          <Send size={12} />
                          Уведомить в TG
                        </button>
                        <button
                          onClick={() => runAction(event.id, "crm_task")}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold"
                        >
                          <SquareCheckBig size={12} />
                          Задача в CRM
                        </button>
                        <select
                          value={event.status}
                          onChange={(e) => updateStatus(event.id, e.target.value as CalendarEvent["status"])}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                        >
                          <option value="planned">Запланировано</option>
                          <option value="done">Выполнено</option>
                          <option value="canceled">Отменено</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {grouped.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-muted">
                Нет событий. Создайте первую встречу справа.
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Plus size={16} />
            Новое событие
          </h3>
          <div className="space-y-2 text-sm">
            <label className="block">
              <span className="mb-1 block text-xs text-muted">Название</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="mb-1 block text-xs text-muted">Дата</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-muted">Время</span>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="mb-1 block text-xs text-muted">Длительность (мин)</span>
                <input type="number" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 p-2" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-muted">Ответственный</span>
                <input value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
              </label>
            </div>
            <label>
              <span className="mb-1 block text-xs text-muted">Комментарий</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>

            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={notifyTelegram} onChange={(e) => setNotifyTelegram(e.target.checked)} />
              Уведомлять в Telegram-бот
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={createCrmTask} onChange={(e) => setCreateCrmTask(e.target.checked)} />
              Создать задачу в CRM
            </label>

            <button
              onClick={createEvent}
              disabled={saving}
              className="mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white"
            >
              <Plus size={14} />
              {saving ? "Сохраняем..." : "Добавить в календарь"}
            </button>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
          <MessageCircle size={16} />
          Логи уведомлений и CRM-действий
        </h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg border border-slate-200 p-2 text-sm">
              <p>{log.message}</p>
              <p className="text-xs text-muted">{new Date(log.createdAt).toLocaleString("ru-RU")}</p>
            </div>
          ))}
          {logs.length === 0 ? <p className="text-sm text-muted">Пока нет действий. Логи появятся после отправки уведомлений/задач.</p> : null}
        </div>
      </Card>
    </div>
  );
}
