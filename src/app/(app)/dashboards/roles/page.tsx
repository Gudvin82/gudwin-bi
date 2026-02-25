"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

const roles = [
  {
    id: "owner",
    title: "Дашборд владельца",
    description: "Индекс здоровья, кассовые риски, ключевые решения недели.",
    focus: ["Health Score", "Фокус дня", "Деньги на 30 дней"],
    href: "/owner"
  },
  {
    id: "finance",
    title: "Дашборд финансов",
    description: "Cash guard, ДДС, P&L, платежный календарь.",
    focus: ["Касса", "P&L", "Платежи"],
    href: "/finance"
  },
  {
    id: "marketing",
    title: "Дашборд маркетинга",
    description: "ROMI, CAC, эффективность кампаний и экспериментов.",
    focus: ["ROMI", "Кампании", "Эксперименты"],
    href: "/marketing"
  },
  {
    id: "sales",
    title: "Дашборд продаж",
    description: "Воронка, сделки, конверсия, средний чек.",
    focus: ["Воронка", "Сделки", "Средний чек"],
    href: "/analytics"
  }
];

export default function RoleDashboardsPage() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-emerald-50">
        <h2 className="text-2xl font-extrabold">Ролевые дашборды</h2>
        <p className="mt-1 text-sm text-muted">Готовые экраны под роль: владелец, финансы, маркетинг, продажи.</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.id} className="bg-white/90">
            <p className="text-xs text-muted">Роль</p>
            <h3 className="text-base font-semibold">{role.title}</h3>
            <p className="mt-1 text-sm text-muted">{role.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {role.focus.map((item) => (
                <span key={item} className="rounded-full border border-border bg-slate-50 px-2 py-1">{item}</span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={role.href} className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white">
                Открыть
              </Link>
              <Link href="/dashboards/builder" className="rounded-xl border border-border px-3 py-2 text-sm font-semibold">
                Настроить
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
