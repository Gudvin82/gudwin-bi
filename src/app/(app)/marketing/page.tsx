"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Overview = {
  index: number;
  period: string;
  spend: number;
  revenue: number;
  romi: number;
  cac: number;
  topChannels: Array<{ name: string; romi: number }>;
  problemChannels: Array<{ name: string; romi: number }>;
  recommendations: string[];
};

export default function MarketingOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/overview");
      const json = await res.json();
      setOverview(json.overview ?? null);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Маркетинговый кабинет</h2>
            <p className="text-sm text-muted">Здесь вы видите, как маркетинг влияет на деньги и прибыль. Красное — проверить, зеленое — усиливать.</p>
          </div>
          <HelpPopover
            title="Что показывает экран"
            items={[
              "Индекс эффективности маркетинга за последние 30 дней.",
              "Суммарные расходы, выручка, ROMI и CAC.",
              "Лучшие и проблемные каналы + рекомендации на неделю."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-muted">Индекс эффективности маркетинга</p>
          <p className={`mt-1 text-4xl font-extrabold ${(overview?.index ?? 0) < 60 ? "text-amber-700" : "text-emerald-700"}`}>{overview?.index ?? "--"}</p>
          <p className="text-xs text-muted">Суммарная отдача за {overview?.period ?? "период"}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Расходы на маркетинг</p>
          <p className="mt-1 text-2xl font-extrabold">{(overview?.spend ?? 0).toLocaleString("ru-RU")} ₽</p>
          <p className="text-xs text-muted">+7.4% к прошлому периоду</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Выручка от маркетинга</p>
          <p className="mt-1 text-2xl font-extrabold">{(overview?.revenue ?? 0).toLocaleString("ru-RU")} ₽</p>
          <p className="text-xs text-muted">Оценка влияния paid-каналов</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">ROMI / CAC</p>
          <p className="mt-1 text-2xl font-extrabold">{overview?.romi ?? "--"}% / {(overview?.cac ?? 0).toLocaleString("ru-RU")} ₽</p>
          <p className="text-xs text-muted">Средний CAC по каналам</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-base font-semibold">Лучшие каналы (топ-3)</h3>
          <div className="space-y-2 text-sm">
            {(overview?.topChannels ?? []).map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <span>{item.name}</span>
                <span className="font-semibold text-emerald-700">ROMI {item.romi}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-base font-semibold">Проблемные каналы (топ-3)</h3>
          <div className="space-y-2 text-sm">
            {(overview?.problemChannels ?? []).map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3">
                <span>{item.name}</span>
                <span className="font-semibold text-rose-700">ROMI {item.romi}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Рекомендации на неделю</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {(overview?.recommendations ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/marketing/campaigns" className="rounded-xl border border-border px-3 py-2 text-sm">Открыть кампании</Link>
          <Link href="/advisor" className="rounded-xl border border-border px-3 py-2 text-sm">Спросить AI-советника</Link>
        </div>
      </Card>
    </div>
  );
}
