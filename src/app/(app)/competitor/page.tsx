"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Signal = { competitor: string; signal: string; action: string };

export default function CompetitorPage() {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/competitor/watch");
      const json = await res.json();
      setSignals(json.signals ?? []);
    };

    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-fuchsia-50 to-pink-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Конкурентный мониторинг</h2>
            <p className="text-sm text-muted">Мониторинг цен, акций и сигналов конкурентов с рекомендациями действий.</p>
          </div>
          <HelpPopover
            title="Как читать сигналы"
            items={[
              "Сигналы показывают изменения у конкурентов.",
              "Рекомендация — быстрый шаг, который стоит сделать.",
              "Подключите источники, чтобы добавить больше сигналов."
            ]}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Сигналы и рекомендации</h3>
        <div className="space-y-2 text-sm">
          {signals.map((item) => (
            <div key={`${item.competitor}-${item.signal}`} className="rounded-xl border border-border p-3">
              <p className="font-semibold">{item.competitor}</p>
              <p className="text-muted">Сигнал: {item.signal}</p>
              <p>Действие: {item.action}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
