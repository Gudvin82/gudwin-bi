"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContextHelpLinks } from "@/components/learn/context-help-links";
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

  const efficiencyTone = useMemo(() => {
    const score = overview?.index ?? 0;
    if (score >= 75) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  }, [overview?.index]);

  return (
    <div className="space-y-5">
      <Card className="animate-fade-up bg-gradient-to-br from-indigo-50 via-cyan-50/70 to-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Маркетинговый кабинет</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Маркетинговый кабинет</h2>
            <p className="mt-1 text-sm text-muted">Как маркетинг влияет на деньги и прибыль: что усиливать, а что немедленно останавливать.</p>
            <Link href="/automation" className="mt-2 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              Создать правило из маркетинговой метрики
            </Link>
          </div>
          <HelpPopover
            title="Что показывает экран"
            items={[
              "Индекс эффективности маркетинга за 30 дней.",
              "Расходы, выручка, ROMI и CAC по всем каналам.",
              "Топ-каналы и проблемные зоны с рекомендациями на неделю."
            ]}
          />
        </div>
      </Card>

      <div className="sticky top-0 z-20 -mx-1 overflow-x-auto bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(248,250,252,0.9))] px-1 py-2 backdrop-blur">
        <div className="flex min-w-max gap-2">
          {[
            { href: "/marketing", label: "Обзор" },
            { href: "/marketing/analytics", label: "Аналитика" },
            { href: "/marketing/campaigns", label: "Кампании" },
            { href: "/marketing/experiments", label: "Эксперименты" },
            { href: "/marketing/creatives", label: "Креативы" },
            { href: "/marketing/sources", label: "Источники" }
          ].map((tab) => (
            <Link key={tab.href} href={tab.href} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="bg-slate-950 text-white">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Индекс эффективности</p>
          <p className={`mt-2 text-5xl font-extrabold ${efficiencyTone}`}>{overview?.index ?? "--"}</p>
          <p className="mt-1 text-xs text-slate-300">Суммарная отдача за {overview?.period ?? "период"}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Расходы на маркетинг</p>
          <p className="mt-2 text-2xl font-extrabold">{(overview?.spend ?? 0).toLocaleString("ru-RU")} ₽</p>
          <p className="text-xs text-muted">+7.4% к прошлому периоду</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Выручка от маркетинга</p>
          <p className="mt-2 text-2xl font-extrabold">{(overview?.revenue ?? 0).toLocaleString("ru-RU")} ₽</p>
          <p className="text-xs text-muted">Влияние платных каналов</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">ROMI / CAC</p>
          <p className="mt-2 text-2xl font-extrabold">{overview?.romi ?? "--"}%</p>
          <p className="text-xs text-muted">CAC: {(overview?.cac ?? 0).toLocaleString("ru-RU")} ₽</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Лучшие каналы</h3>
          <div className="space-y-2 text-sm">
            {(overview?.topChannels ?? []).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 px-3 py-2">
                <span>{idx + 1}. {item.name}</span>
                <span className="font-semibold text-emerald-700">ROMI {item.romi}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 text-base font-semibold">Проблемные каналы</h3>
          <div className="space-y-2 text-sm">
            {(overview?.problemChannels ?? []).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-3 py-2">
                <span>{idx + 1}. {item.name}</span>
                <span className="font-semibold text-rose-700">ROMI {item.romi}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Рекомендации на неделю</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {(overview?.recommendations ?? []).map((item) => (
            <div key={item} className="rounded-xl border border-border bg-gradient-to-br from-white to-slate-50 p-3 text-sm">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/marketing/campaigns" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white">Разобрать кампании</Link>
          <Link href="/advisor" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Спросить AI-советника</Link>
          <Link href="/marketing/experiments" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Запустить A/B тест</Link>
        </div>
      </Card>

      <ContextHelpLinks section="marketing" />
    </div>
  );
}
