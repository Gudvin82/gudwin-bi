"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Creative = {
  id: string;
  title: string;
  channel: string;
  format: string;
  ctr: number;
  conversion: number;
  romi: number;
  best: boolean;
};

export default function MarketingCreativesPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/creatives");
      const json = await res.json();
      setCreatives(json.creatives ?? []);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Креативы</h2>
            <p className="text-sm text-muted">Генерация и хранение рекламных креативов с привязкой к эффективности.</p>
          </div>
          <HelpPopover
            title="Как работать с креативами"
            items={[
              "Создавайте варианты под конкретный канал и оффер.",
              "Сравнивайте CTR, конверсию и ROMI.",
              "Масштабируйте креативы с меткой «Лучший»."
            ]}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Создать креатив</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="rounded-xl border border-border p-2 text-sm" placeholder="Ниша/продукт" />
          <input className="rounded-xl border border-border p-2 text-sm" placeholder="Оффер" />
          <select className="rounded-xl border border-border p-2 text-sm">
            <option>Яндекс.Директ</option>
            <option>VK Реклама</option>
            <option>Telegram Ads</option>
          </select>
        </div>
        <button className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Сгенерировать варианты</button>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {creatives.map((item) => (
          <Card key={item.id} className="bg-white/90">
            <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100" />
            <p className="text-xs text-muted">{item.channel} • {item.format}</p>
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="mt-1 text-xs text-muted">CTR {item.ctr}% • Конверсия {item.conversion}% • ROMI {item.romi}%</p>
            {item.best ? <span className="mt-2 inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Лучший</span> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
