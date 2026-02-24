"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type OwnerPayload = {
  health: { score: number; components: { financial: number; cash: number; operations: number; riskPenalty: number } };
  focusOfDay: string;
  problemOfWeek: string;
};

export default function OwnerPage() {
  const [data, setData] = useState<OwnerPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/owner/health");
      const json = (await res.json()) as OwnerPayload;
      setData(json);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-emerald-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Режим владельца (Owner Mode)</h2>
            <p className="text-sm text-muted">Здесь вы видите общее здоровье бизнеса, главную проблему недели и фокус дня.</p>
          </div>
          <HelpPopover
            title="Подсказка по разделу"
            items={[
              "Индекс здоровья показывает общее состояние бизнеса по шкале 0-100.",
              "Главная проблема недели помогает быстро найти точку внимания.",
              "Фокус дня — конкретное действие, которое стоит сделать сегодня."
            ]}
          />
        </div>
      </Card>

      <div className="dashboard-grid">
        <Card className="col-span-12 md:col-span-4">
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm text-muted">Индекс здоровья бизнеса (Health Score)</p>
            <HelpPopover
              title="Что означает индекс"
              items={[
                "Выше 75 — хороший уровень устойчивости.",
                "От 55 до 75 — нужен точечный контроль рисков.",
                "Ниже 55 — требуется немедленная корректировка финансов и операций."
              ]}
            />
          </div>
          <p className="text-5xl font-extrabold text-accent">{data?.health.score ?? "--"}</p>
          <p className="text-xs text-muted">0-100, чем выше, тем устойчивее бизнес</p>
        </Card>
        <Card className="col-span-12 md:col-span-8">
          <p className="mb-2 text-sm font-semibold">Компоненты</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl border border-border p-3">Финансы: {data?.health.components.financial ?? "--"}</div>
            <div className="rounded-xl border border-border p-3">Cash: {data?.health.components.cash ?? "--"}</div>
            <div className="rounded-xl border border-border p-3">Операции: {data?.health.components.operations ?? "--"}</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-2 text-sm font-semibold">Главная проблема недели</p>
          <p className="text-sm">{data?.problemOfWeek ?? "Загрузка..."}</p>
        </Card>
        <Card>
          <p className="mb-2 text-sm font-semibold">Главный фокус дня</p>
          <p className="text-sm">{data?.focusOfDay ?? "Загрузка..."}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/finance" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            Перейти в Финансы (Smart Finance)
          </Link>
          <Link href="/advisor" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Открыть Консультант (Smart Advisor)
          </Link>
          <Link href="/watch" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Смотреть алерты
          </Link>
        </div>
      </Card>
    </div>
  );
}
