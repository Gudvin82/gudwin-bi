"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContextHelpLinks } from "@/components/learn/context-help-links";
import { DashboardShowcase } from "@/components/dashboard/dashboard-showcase";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type OwnerPayload = {
  health: { score: number; components: { financial: number; cash: number; operations: number; riskPenalty: number } };
  focusOfDay: string;
  problemOfWeek: string;
};

export default function OwnerPage() {
  const [data, setData] = useState<OwnerPayload>({
    health: { score: 78, components: { financial: 74, cash: 62, operations: 81, riskPenalty: 8 } },
    focusOfDay: "Проверить 3 просроченные дебиторки и снизить кассовый риск.",
    problemOfWeek: "ROMI в 2 маркетинговых каналах ниже целевого порога."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/owner/health");
      const json = (await res.json()) as OwnerPayload;
      setData(json);
      setLoading(false);
    };
    void load();
  }, []);

  const healthGradient = useMemo(() => {
    const degree = Math.round((data.health.score / 100) * 360);
    return `conic-gradient(#0891b2 0deg, #10b981 ${degree}deg, rgba(226,232,240,.9) ${degree}deg 360deg)`;
  }, [data.health.score]);
  const healthZone =
    data.health.score < 40
      ? { label: "Критическая зона", tone: "text-rose-700" }
      : data.health.score < 70
        ? { label: "Зона внимания", tone: "text-amber-700" }
        : { label: "Стабильная зона", tone: "text-emerald-700" };

  return (
    <div className="space-y-5">
      <Card className="animate-fade-up bg-gradient-to-br from-white via-cyan-50/60 to-emerald-50/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Режим владельца</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Режим владельца</h2>
            <p className="mt-1 text-sm text-muted">Главная витрина бизнеса: здоровье компании, главная проблема недели и фокус дня.</p>
          </div>
          <HelpPopover
            title="Как читать этот экран"
            items={[
              "Смотрите сначала индекс здоровья и динамику компонентов.",
              "Проблема недели — главная зона риска.",
              "Фокус дня — одно действие, которое даст максимальный эффект сегодня."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Индекс здоровья</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{loading ? "Обновляем" : "Актуально"}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div className="relative grid h-40 w-40 place-content-center rounded-full" style={{ background: healthGradient }}>
              <div className="grid h-28 w-28 place-content-center rounded-full bg-slate-950 text-center">
                <p className="text-4xl font-extrabold leading-none">{data.health.score}</p>
                <p className="mt-1 text-xs text-cyan-200">из 100</p>
              </div>
            </div>
            <div className="min-w-[220px] flex-1 space-y-2 text-sm">
              <div className={`rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold ${healthZone.tone}`}>
                {healthZone.label}: {data.health.score}/100
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                <span>Финансы</span>
                <span className="font-semibold">{data.health.components.financial}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                <span>Деньги</span>
                <span className="font-semibold">{data.health.components.cash}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                <span>Операции</span>
                <span className="font-semibold">{data.health.components.operations}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-rose-300/20 px-3 py-2 text-rose-100">
                <span>Штраф риска</span>
                <span className="font-semibold">-{data.health.components.riskPenalty}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-rose-50 to-orange-50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">Главная проблема недели</p>
            <p className="text-sm font-medium text-slate-800">{data.problemOfWeek}</p>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Фокус дня</p>
            <p className="text-sm font-medium text-slate-800">{data.focusOfDay}</p>
          </Card>
          <Card className="bg-gradient-to-r from-sky-50 to-indigo-50">
            <p className="text-xs text-muted">Маркетинг</p>
            <p className="mt-1 text-sm font-semibold">Расходы: 1 790 000 ₽ • ROMI: 50.8%</p>
            <Link href="/marketing" className="mt-3 inline-flex rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
              Перейти в маркетинг
            </Link>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Динамика здоровья бизнеса (12 недель)</h3>
        <div className="flex items-end gap-2 rounded-xl border border-border bg-white p-3">
          {[58, 61, 63, 60, 66, 69, 72, 70, 74, 76, 79, data.health.score].map((value, idx) => (
            <div key={`health-${idx}`} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-teal-400" style={{ height: `${Math.max(14, value)}px` }} />
              <span className="text-[10px] text-muted">W{idx + 1}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/finance" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white">Финансы</Link>
          <Link href="/marketing" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Маркетинг</Link>
          <Link href="/advisor" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">AI-советник</Link>
          <Link href="/watch" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Мониторинг</Link>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-white via-slate-50 to-cyan-50">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Визуальные дашборды дня</h3>
            <p className="text-sm text-muted">Быстрый срез: выручка, каналы, риски и движение денег.</p>
          </div>
          <Link href="/dashboards" className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
            Открыть все дашборды
          </Link>
        </div>
        <DashboardShowcase />
      </Card>

      <ContextHelpLinks section="owner" />
    </div>
  );
}
