"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ContextHelpLinks } from "@/components/learn/context-help-links";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type UnitMetric = { dimension: string; cac: number; ltv: number; contribution_margin: number; romi: number; payback_days: number };
type CashRow = { date: string; inflow: number; outflow: number; balance: number };
type Leak = { id: string; title: string; severity: "high" | "medium" | "low"; impact: string; recommendation: string };
type Payment = { id: string; date: string; type: "incoming" | "outgoing"; counterparty: string; amount: number; status: string };
type MarketingOverview = { romi: number; cac: number };

const paymentStatusLabel: Record<string, string> = {
  planned: "Запланирован",
  paid: "Оплачен",
  overdue: "Просрочен"
};

export default function FinancePage() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<UnitMetric[]>([]);
  const [cash, setCash] = useState<CashRow[]>([]);
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [marketing, setMarketing] = useState<MarketingOverview | null>(null);
  const [scenario, setScenario] = useState({ priceDeltaPct: 3, adBudgetDeltaPct: 10, managerDelta: 1, discountDeltaPct: 0 });
  const [scenarioResult, setScenarioResult] = useState<{ projectedProfit: number; deltaPct: number; romiProjected: number; cashflowProjected: number; explanation: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, cRes, lRes, pRes, moRes] = await Promise.all([
          fetch("/api/finance/unit-metrics"),
          fetch("/api/finance/cash-guard"),
          fetch("/api/finance/money-leaks"),
          fetch("/api/finance/payment-calendar"),
          fetch("/api/marketing/overview")
        ]);
        if (!mRes.ok || !cRes.ok || !lRes.ok || !pRes.ok || !moRes.ok) {
          throw new Error("load failed");
        }
        const [m, c, l, p, mo] = await Promise.all([
          mRes.json(),
          cRes.json(),
          lRes.json(),
          pRes.json(),
          moRes.json()
        ]);

        setMetrics(m.metrics ?? []);
        setCash(c.forecast30 ?? []);
        setLeaks(l.leaks ?? []);
        setPayments(p.items ?? []);
        setMarketing(mo.overview ?? null);
      } catch {
        setError("Не удалось обновить данные. Проверьте подключение источников.");
      }
    };

    void load();
    setMounted(true);
  }, []);

  const avgLtvCac = useMemo(() => {
    if (!metrics.length) return 0;
    return metrics.reduce((acc, item) => acc + item.ltv / item.cac, 0) / metrics.length;
  }, [metrics]);
  const minBalance30 = useMemo(
    () => Math.min(...(cash.map((c) => c.balance).length ? cash.map((c) => c.balance) : [0])),
    [cash]
  );

  const runScenario = async () => {
    try {
      const res = await fetch("/api/finance/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario)
      });
      const json = await res.json();
      setScenarioResult(json.scenario ?? null);
    } catch {
      setScenarioResult(null);
      setError("Не удалось рассчитать сценарий. Попробуйте позже.");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-sky-50 to-teal-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Финансы</h2>
            <p className="text-sm text-muted">Здесь вы видите прогноз денег, юнит-экономику и зоны потери прибыли.</p>
            {error ? <p className="mt-2 text-xs font-semibold text-amber-700">{error}</p> : null}
            <Link href="/automation" className="mt-2 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              Создать правило из финансовой метрики
            </Link>
          </div>
          <HelpPopover
            title="Что можно сделать в разделе"
            items={[
              "Понять, где возможен кассовый разрыв.",
              "Проверить, окупаются ли каналы продаж и маркетинга.",
              "Смоделировать сценарий и увидеть влияние на прибыль.",
              "Найти утечки денег и приоритизировать действия."
            ]}
          />
        </div>
      </Card>

      <div className="sticky top-0 z-20 -mx-1 overflow-x-auto bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(248,250,252,0.9))] px-1 py-2 backdrop-blur">
        <div className="flex min-w-max gap-2">
          {[
            { href: "#finance-unit", label: "Юнит-экономика" },
            { href: "#finance-cash", label: "Прогноз денег" },
            { href: "#finance-leaks", label: "Утечки" },
            { href: "#finance-payments", label: "Платежи" },
            { href: "#finance-scenario", label: "Сценарии" }
          ].map((tab) => (
            <a key={tab.href} href={tab.href} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              {tab.label}
            </a>
          ))}
          <Link href="/finance/accounting" className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800">
            Финучет и отчеты
          </Link>
        </div>
      </div>

      {!metrics.length ? (
        <Card className="bg-gradient-to-r from-white to-slate-50">
          <p className="text-sm font-semibold">Данных пока нет, но вы в 5 минутах от первого отчета.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
            <li>Подключите Google Sheets / CSV / CRM в разделе источников.</li>
            <li>Мы автоматически рассчитаем Cash Guard и юнит-экономику.</li>
            <li>На этой странице появятся прогноз, утечки денег и платежный календарь.</li>
          </ol>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/sources" className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              Подключить источники данных
            </Link>
            <Link href="/learn/quick-start" className="inline-flex rounded-xl border border-border px-4 py-2 text-sm font-semibold">
              Открыть быстрый старт
            </Link>
          </div>
        </Card>
      ) : null}

      <ContextHelpLinks section="finance" />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm text-muted">Средний LTV/CAC</p>
            <HelpPopover
              title="LTV/CAC"
              items={[
                "Показывает, сколько бизнес зарабатывает на клиенте относительно стоимости привлечения.",
                "Нормой обычно считается значение выше 3.",
                "Если показатель ниже 3, масштабировать рекламу рискованно."
              ]}
            />
          </div>
          <p className={`text-3xl font-extrabold ${avgLtvCac < 3 ? "text-amber-700" : "text-emerald-700"}`}>{avgLtvCac.toFixed(2)}</p>
          <p className="text-xs text-muted">Целевой уровень: {'>'} 3</p>
        </Card>
        <Card>
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm text-muted">Прогноз денег (мин. остаток 30 дней)</p>
            <HelpPopover
              title="Прогноз денег"
              items={[
                "Показывает минимальный прогноз остатка денег за ближайшие 30 дней.",
                "Если значение красное, есть риск кассового разрыва.",
                "Нужно ускорить дебиторку или сместить часть расходов."
              ]}
            />
          </div>
          <p className={`text-3xl font-extrabold ${minBalance30 < 0 ? "text-red-700" : "text-emerald-700"}`}>
            {minBalance30.toLocaleString("ru-RU")} ₽
          </p>
        </Card>
        <Card>
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm text-muted">Найдено утечек денег</p>
            <HelpPopover
              title="Утечки денег"
              items={[
                "Это места, где бизнес теряет прибыль: товары, каналы, клиенты или процессы.",
                "Начинайте с утечек с максимальным денежным эффектом.",
                "После исправлений отслеживайте динамику каждую неделю."
              ]}
            />
          </div>
          <p className="text-3xl font-extrabold">{leaks.length}</p>
        </Card>
        <Card>
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm text-muted">Маркетинг в финансах</p>
            <HelpPopover
              title="Связка с маркетингом"
              items={[
                "Здесь учитываются средние CAC и ROMI по каналам.",
                "Показатели влияют на расчет рисков по марже и cash flow.",
                "Подробная детализация доступна в разделе «Маркетинг»."
              ]}
            />
          </div>
          <p className="text-sm">ROMI: <span className="font-bold">{marketing?.romi ?? "--"}%</span></p>
          <p className="text-sm">CAC: <span className="font-bold">{(marketing?.cac ?? 0).toLocaleString("ru-RU")} ₽</span></p>
          <Link href="/marketing" className="mt-2 inline-flex rounded-lg border border-border px-2 py-1 text-xs">Открыть маркетинг</Link>
        </Card>
      </div>

      <Card id="finance-unit">
        <h3 className="mb-3 text-base font-semibold">Юнит-экономика</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="pb-2">Сегмент</th><th className="pb-2">CAC</th><th className="pb-2">LTV</th><th className="pb-2">LTV/CAC</th><th className="pb-2">ROMI</th><th className="pb-2">Окупаемость</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.dimension} className="border-t border-border">
                  <td className="py-2 font-medium">{m.dimension}</td>
                  <td className="py-2">{m.cac.toLocaleString("ru-RU")} ₽</td>
                  <td className="py-2">{m.ltv.toLocaleString("ru-RU")} ₽</td>
                  <td className={`py-2 ${(m.ltv / m.cac) < 3 ? "text-amber-700" : "text-emerald-700"}`}>{(m.ltv / m.cac).toFixed(2)}</td>
                  <td className="py-2">{m.romi}%</td>
                  <td className="py-2">{m.payback_days} дн</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card id="finance-cash">
          <h3 className="mb-3 text-base font-semibold">Прогноз денег (30 дней)</h3>
          <div className="chart-shell mb-3 h-56">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={180}>
                <AreaChart data={cash}>
                  <defs>
                    <linearGradient id="cashLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                  <Tooltip formatter={(value: number | string | undefined) => `${Number(value ?? 0).toLocaleString("ru-RU")} ₽`} />
                  <Area type="monotone" dataKey="balance" stroke="#0f766e" strokeWidth={2} fill="url(#cashLine)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton h-full w-full" />
            )}
          </div>
          <div className="space-y-1 text-sm">
            {cash.slice(0, 10).map((row) => (
              <div key={row.date} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span>{row.date}</span>
                <span className={row.balance < 0 ? "text-red-700" : "text-emerald-700"}>{row.balance.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
          </div>
        </Card>

        <Card id="finance-scenario">
          <h3 className="mb-3 text-base font-semibold">Сценарный симулятор</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1 text-xs text-muted">
              Цена, %
              <input type="number" value={scenario.priceDeltaPct} onChange={(e) => setScenario({ ...scenario, priceDeltaPct: Number(e.target.value) })} className="w-full rounded-xl border border-border p-2 text-sm text-slate-900" placeholder="Например, +5" />
            </label>
            <label className="space-y-1 text-xs text-muted">
              Рекламный бюджет, %
              <input type="number" value={scenario.adBudgetDeltaPct} onChange={(e) => setScenario({ ...scenario, adBudgetDeltaPct: Number(e.target.value) })} className="w-full rounded-xl border border-border p-2 text-sm text-slate-900" placeholder="Например, +10" />
            </label>
            <label className="space-y-1 text-xs text-muted">
              Менеджеры, шт.
              <input type="number" value={scenario.managerDelta} onChange={(e) => setScenario({ ...scenario, managerDelta: Number(e.target.value) })} className="w-full rounded-xl border border-border p-2 text-sm text-slate-900" placeholder="+1 / -1" />
            </label>
            <label className="space-y-1 text-xs text-muted">
              Скидка, %
              <input type="number" value={scenario.discountDeltaPct} onChange={(e) => setScenario({ ...scenario, discountDeltaPct: Number(e.target.value) })} className="w-full rounded-xl border border-border p-2 text-sm text-slate-900" placeholder="Например, -3" />
            </label>
          </div>
          <button onClick={runScenario} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Рассчитать сценарий</button>
          {scenarioResult ? (
            <div className="mt-3 rounded-xl border border-border p-3 text-sm">
              <p>Прогноз прибыли: {scenarioResult.projectedProfit.toLocaleString("ru-RU")} ₽ ({scenarioResult.deltaPct}%)</p>
              <p>Прогноз ROMI: {scenarioResult.romiProjected}%</p>
              <p>Прогноз cash flow: {scenarioResult.cashflowProjected.toLocaleString("ru-RU")} ₽</p>
              <p className="text-muted">{scenarioResult.explanation}</p>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card id="finance-leaks">
          <h3 className="mb-3 text-base font-semibold">Сканер утечек денег</h3>
          <div className="space-y-2">
            {leaks.map((leak) => (
              <div key={leak.id} className="rounded-xl border border-border p-3 text-sm">
                <p className="font-semibold">{leak.title}</p>
                <p className="text-muted">Влияние: {leak.impact}</p>
                <p className="text-muted">Рекомендация: {leak.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card id="finance-payments">
          <h3 className="mb-3 text-base font-semibold">Платежный календарь</h3>
          <div className="space-y-2 text-sm">
            {payments.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="font-semibold">{item.counterparty}</p>
                  <p className="text-muted">{item.date} • {item.type === "incoming" ? "Входящий" : "Исходящий"}</p>
                </div>
                <div className="text-right">
                  <p>{item.amount.toLocaleString("ru-RU")} ₽</p>
                  <p className={`text-xs ${item.status === "overdue" ? "text-red-700" : "text-muted"}`}>
                    {paymentStatusLabel[item.status] ?? item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
