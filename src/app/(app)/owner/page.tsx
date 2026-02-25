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

const weekLabels = ["10.12", "17.12", "24.12", "31.12", "07.01", "14.01", "21.01", "28.01", "04.02", "11.02", "18.02", "25.02"];

export default function OwnerPage() {
  const [data, setData] = useState<OwnerPayload>({
    health: { score: 78, components: { financial: 74, cash: 62, operations: 81, riskPenalty: 8 } },
    focusOfDay: "Проверить 3 просроченные дебиторки и снизить кассовый риск.",
    problemOfWeek: "ROMI в 2 маркетинговых каналах ниже целевого порога."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [focusDone, setFocusDone] = useState(false);
  const [pdfStatus, setPdfStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/owner/health");
        if (!res.ok) {
          throw new Error("load failed");
        }
        const json = (await res.json()) as OwnerPayload;
        setData(json);
      } catch {
        setError("Не удалось загрузить данные. Показаны демо-значения.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const healthGradient = useMemo(
    () =>
      "conic-gradient(#ef4444 0deg 108deg, #f59e0b 108deg 189deg, #10b981 189deg 270deg, rgba(255,255,255,0.08) 270deg 360deg)",
    []
  );
  const healthNeedleRotation = useMemo(() => Math.round(-135 + (data.health.score / 100) * 270), [data.health.score]);
  const healthZone =
    data.health.score < 40
      ? { label: "Критическая зона", tone: "text-rose-700" }
      : data.health.score < 70
        ? { label: "Зона внимания", tone: "text-amber-700" }
        : { label: "Стабильная зона", tone: "text-emerald-700" };
  const weeks = useMemo(() => weekLabels, []);

  const exportPdf = () => {
    setPdfStatus("PDF формируется. Ссылка для скачивания появится в разделе отчётов.");
    setTimeout(() => setPdfStatus(""), 4000);
  };

  return (
    <div className="space-y-5">
      <Card className="animate-fade-up bg-gradient-to-br from-white via-cyan-50/60 to-emerald-50/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight">Режим владельца</h2>
            <p className="mt-1 text-sm text-muted">Главная витрина бизнеса: здоровье компании, главная проблема недели и фокус дня.</p>
            {error ? <p className="mt-2 text-xs font-semibold text-amber-700">{error}</p> : null}
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

      <Card className="bg-gradient-to-r from-emerald-50 via-white to-cyan-50">
        <p className="text-sm font-semibold text-emerald-800">Ваш Health Score {data.health.score} — {healthZone.label.toLowerCase()}</p>
        <p className="mt-1 text-sm text-muted">Показатель рассчитывается по финансам, ликвидности, операционке и рискам. Динамика за неделю: +5 пунктов.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/advisor" className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700">
            Узнать, как дойти до 90
          </Link>
          <Link href="/marketing" className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold">
            Сравнить маркетинг с бенчмарком
          </Link>
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
              <span
                className="absolute left-1/2 top-1/2 h-[72px] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-white shadow"
                style={{ transform: `translateX(-50%) translateY(-100%) rotate(${healthNeedleRotation}deg)` }}
              />
              <div className="grid h-28 w-28 place-content-center rounded-full bg-slate-950 text-center">
                <p className="text-4xl font-extrabold leading-none">{data.health.score}</p>
                <p className="mt-1 text-xs text-cyan-200">из 100</p>
              </div>
            </div>
            <div className="min-w-[220px] flex-1 space-y-2 text-sm">
              <div className={`rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold ${healthZone.tone}`}>
                {healthZone.label}: {data.health.score}/100
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-center text-rose-700">0-40 риск</div>
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-center text-amber-700">41-70 внимание</div>
                <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-center text-emerald-700">71-100 норма</div>
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
                <span>Риск-премия</span>
                <span className="font-semibold">{Math.abs(data.health.components.riskPenalty)} б.</span>
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
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setFocusDone((prev) => !prev)}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700"
              >
                {focusDone ? "✓ Выполнено" : "Отметить выполнено"}
              </button>
              {focusDone ? <span className="inline-flex items-center rounded-lg bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Отлично, двигаемся к 90/100</span> : null}
            </div>
          </Card>
          <Card className="bg-gradient-to-r from-sky-50 to-indigo-50">
            <p className="text-xs text-muted">Маркетинг</p>
            <p className="mt-1 text-sm font-semibold">Расходы: 1 790 000 ₽ • ROMI: 50.8%</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/marketing" className="inline-flex rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
                Перейти в маркетинг
              </Link>
              <Link href="/goals" className="inline-flex rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
                Открыть цели
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Динамика здоровья бизнеса (12 недель)</h3>
          <div className="flex flex-col items-end gap-1 text-right">
            <button onClick={exportPdf} className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold">
              Скачать PDF отчёт
            </button>
            {pdfStatus ? <span className="text-[11px] text-muted">{pdfStatus}</span> : null}
          </div>
        </div>
        <div className="flex items-end gap-2 rounded-xl border border-border bg-white p-3">
          {[58, 61, 63, 60, 66, 69, 72, 70, 74, 76, 79, data.health.score].map((value, idx) => (
            <div key={`health-${idx}`} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-teal-400" style={{ height: `${Math.max(14, value)}px` }} />
              <span className="text-[10px] text-muted">{weeks[idx]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/finance" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white">Финансы</Link>
          <Link href="/marketing" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Маркетинг</Link>
          <Link href="/advisor" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">ИИ-советник</Link>
          <Link href="/goals" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Цели</Link>
          <Link href="/automation" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Сценарии и агенты</Link>
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
