"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const templates = [
  {
    title: "Кассовый риск",
    flow: "Когда cash_guard_days < 7 → отправить Telegram + создать задачу владельцу",
    result: "Быстрый контроль кассового разрыва"
  },
  {
    title: "Падение ROMI",
    flow: "Когда ROMI < 20% → запустить ИИ‑анализ маркетинга",
    result: "Оперативный разбор убыточных каналов"
  },
  {
    title: "Просроченная дебиторка",
    flow: "Когда просрочка > 3 дней → уведомление + задача в CRM",
    result: "Снижение зависших оплат"
  }
];

export default function AutomationTemplatesPage() {
  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-violet-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Готовые шаблоны сценариев</h2>
            <p className="mt-1 text-sm text-muted">Выберите сценарий и примените за 1 клик, без ручной настройки каждого кубика.</p>
          </div>
          <HelpPopover
            title="Как использовать шаблоны"
            items={[
              "Выберите типичный сценарий.",
              "Проверьте шаги и отредактируйте при необходимости.",
              "Запустите и включите автосрабатывание."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.title}>
            <p className="text-sm font-bold">{template.title}</p>
            <p className="mt-2 text-xs text-slate-600">{template.flow}</p>
            <p className="mt-2 text-xs text-emerald-700">{template.result}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white">Применить</button>
              <Link href="/automation" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">Изменить</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
