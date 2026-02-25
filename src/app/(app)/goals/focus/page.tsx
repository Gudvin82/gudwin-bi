"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const focusList = [
  {
    title: "Сегодня",
    item: "Закрыть 3 просроченные дебиторки до 18:00",
    impact: "+210 000 ₽ к доступному остатку"
  },
  {
    title: "На неделю",
    item: "Остановить 2 убыточные кампании и перераспределить бюджет",
    impact: "+9.8 п.п. к ROMI по неделе"
  },
  {
    title: "На месяц",
    item: "Снизить долю скидок в низкомаржинальных SKU",
    impact: "+3.2 п.п. к валовой марже"
  }
];

export default function GoalsFocusPage() {
  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Фокус владельца</h2>
            <p className="mt-1 text-sm text-muted">Одна приоритетная задача на день, неделю и месяц с ожидаемым эффектом.</p>
          </div>
          <HelpPopover
            title="Как использовать"
            items={[
              "Начинайте с блока «Сегодня».",
              "Дальше переходите к недельному фокусу.",
              "Месячный фокус держит стратегию и рост."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {focusList.map((focus) => (
          <Card key={focus.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{focus.title}</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">{focus.item}</p>
            <p className="mt-2 text-xs text-emerald-700">{focus.impact}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/goals" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
            Вернуться к целям
          </Link>
          <Link href="/automation" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white">
            Создать сценарий из фокуса
          </Link>
          <Link href="/owner" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
            Открыть рабочий кабинет
          </Link>
        </div>
      </Card>
    </div>
  );
}
