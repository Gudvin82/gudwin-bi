"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type UnitMetric = { dimension: string; cac: number; ltv: number; contribution_margin: number; romi: number; payback_days: number };
type CashRow = { date: string; inflow: number; outflow: number; balance: number };
type Leak = { id: string; title: string; severity: "high" | "medium" | "low"; impact: string; recommendation: string };
type Payment = { id: string; date: string; type: "incoming" | "outgoing"; counterparty: string; amount: number; status: string };
type MarketingOverview = { romi: number; cac: number };

export default function FinancePage() {
  const [metrics, setMetrics] = useState<UnitMetric[]>([]);
  const [cash, setCash] = useState<CashRow[]>([]);
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [marketing, setMarketing] = useState<MarketingOverview | null>(null);
  const [scenario, setScenario] = useState({ priceDeltaPct: 3, adBudgetDeltaPct: 10, managerDelta: 1, discountDeltaPct: 0 });
  const [scenarioResult, setScenarioResult] = useState<{ projectedProfit: number; deltaPct: number; romiProjected: number; cashflowProjected: number; explanation: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const [m, c, l, p, mo] = await Promise.all([
        fetch("/api/finance/unit-metrics").then((r) => r.json()),
        fetch("/api/finance/cash-guard").then((r) => r.json()),
        fetch("/api/finance/money-leaks").then((r) => r.json()),
        fetch("/api/finance/payment-calendar").then((r) => r.json()),
        fetch("/api/marketing/overview").then((r) => r.json())
      ]);

      setMetrics(m.metrics ?? []);
      setCash(c.forecast30 ?? []);
      setLeaks(l.leaks ?? []);
      setPayments(p.items ?? []);
      setMarketing(mo.overview ?? null);
    };

    void load();
  }, []);

  const avgLtvCac = useMemo(() => {
    if (!metrics.length) return 0;
    return metrics.reduce((acc, item) => acc + item.ltv / item.cac, 0) / metrics.length;
  }, [metrics]);

  const runScenario = async () => {
    const res = await fetch("/api/finance/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scenario)
    });
    const json = await res.json();
    setScenarioResult(json.scenario ?? null);
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-sky-50 to-teal-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Финансы</h2>
            <p className="text-sm text-muted">Здесь вы видите прогноз денег, юнит-экономику и зоны потери прибыли.</p>
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

      {!metrics.length ? (
        <Card>
          <p className="text-sm text-muted">
            Пока нет финансовых данных для расчета. Подключите Google Sheets или CRM, чтобы увидеть прогноз кассовых разрывов и юнит-экономику.
          </p>
          <Link href="/sources" className="mt-3 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            Подключить источники данных
          </Link>
        </Card>
      ) : null}

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
          <p className={`text-3xl font-extrabold ${Math.min(...(cash.map((c) => c.balance).length ? cash.map((c) => c.balance) : [0])) < 0 ? "text-red-700" : "text-emerald-700"}`}>
            {(Math.min(...(cash.map((c) => c.balance).length ? cash.map((c) => c.balance) : [0]))).toLocaleString("ru-RU")} ₽
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

      <Card>
        <h3 className="mb-3 text-base font-semibold">Юнит-экономика</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="pb-2">Сегмент</th><th className="pb-2">CAC</th><th className="pb-2">LTV</th><th className="pb-2">LTV/CAC</th><th className="pb-2">ROMI</th><th className="pb-2">Payback</th>
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
        <Card>
          <h3 className="mb-3 text-base font-semibold">Прогноз денег (30 дней)</h3>
          <div className="space-y-1 text-sm">
            {cash.slice(0, 10).map((row) => (
              <div key={row.date} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span>{row.date}</span>
                <span className={row.balance < 0 ? "text-red-700" : "text-emerald-700"}>{row.balance.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Сценарный симулятор</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="number" value={scenario.priceDeltaPct} onChange={(e) => setScenario({ ...scenario, priceDeltaPct: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Цена %" />
            <input type="number" value={scenario.adBudgetDeltaPct} onChange={(e) => setScenario({ ...scenario, adBudgetDeltaPct: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Реклама %" />
            <input type="number" value={scenario.managerDelta} onChange={(e) => setScenario({ ...scenario, managerDelta: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Менеджеры +/-" />
            <input type="number" value={scenario.discountDeltaPct} onChange={(e) => setScenario({ ...scenario, discountDeltaPct: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Скидка %" />
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
        <Card>
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

        <Card>
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
                  <p className={`text-xs ${item.status === "overdue" ? "text-red-700" : "text-muted"}`}>{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
