"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Experiment = {
  id: string;
  name: string;
  hypothesis: string;
  metric: string;
  status: string;
  winner: string;
  a: { ctr: number; conversion: number; romi: number };
  b: { ctr: number; conversion: number; romi: number };
};

export default function MarketingExperimentsPage() {
  const [items, setItems] = useState<Experiment[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/experiments");
      const json = await res.json();
      setItems(json.experiments ?? []);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-fuchsia-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Эксперименты</h2>
            <p className="text-sm text-muted">Системные A/B-тесты гипотез по креативам, офферам и аудиториям.</p>
          </div>
          <HelpPopover
            title="Как запускать тесты"
            items={[
              "Задайте гипотезу и метрику успеха.",
              "Сравните варианты A и B по CTR, конверсии и ROMI.",
              "После выбора победителя масштабируйте кампанию."
            ]}
          />
        </div>
      </Card>

      <Card>
        <button className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Создать новый эксперимент</button>
      </Card>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <p className="text-xs text-muted">{item.status} • Метрика: {item.metric}</p>
            <h3 className="text-base font-semibold">{item.name}</h3>
            <p className="text-sm text-muted">Гипотеза: {item.hypothesis}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded-xl border border-border p-3">
                <p className="font-semibold">Вариант A</p>
                <p>CTR: {item.a.ctr}%</p>
                <p>Конверсия: {item.a.conversion}%</p>
                <p>ROMI: {item.a.romi}%</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="font-semibold">Вариант B</p>
                <p>CTR: {item.b.ctr}%</p>
                <p>Конверсия: {item.b.conversion}%</p>
                <p>ROMI: {item.b.romi}%</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">
              AI-вывод: {item.winner === "Нет" ? "Разница статистически незначима, стоит продлить тест." : `Победитель — вариант ${item.winner}.`}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
