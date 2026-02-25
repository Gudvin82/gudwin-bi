"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Row = {
  name: string;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  deals: number;
  spend: number;
  revenue: number;
  margin: number;
  cpl: number;
  cac: number;
  romi: number;
  roas: number;
};

export default function MarketingAnalyticsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/analytics");
      const json = await res.json();
      setRows(json.rows ?? []);
    };
    void load();
    setMounted(true);
  }, []);

  const funnel = useMemo(() => {
    const totals = rows.reduce(
      (acc, item) => {
        acc.impressions += item.impressions;
        acc.clicks += item.clicks;
        acc.leads += item.leads;
        acc.deals += item.deals;
        return acc;
      },
      { impressions: 0, clicks: 0, leads: 0, deals: 0 }
    );
    return totals;
  }, [rows]);

  const hasData = rows.length > 0;
  const avgCac = useMemo(() => (rows.length ? Math.round(rows.reduce((acc, item) => acc + item.cac, 0) / rows.length) : 0), [rows]);
  const avgLtv: number = 0;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-sky-50 to-indigo-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Маркетинговая аналитика</h2>
            <p className="text-sm text-muted">Сквозная аналитика каналов, воронка и ключевая юнит-экономика маркетинга.</p>
          </div>
          <HelpPopover
            title="Подсказка"
            items={[
              "CAC — стоимость привлечения одного платящего клиента.",
              "ROMI — окупаемость маркетинговых инвестиций.",
              "LTV — ценность клиента за весь период взаимодействия."
            ]}
          />
        </div>
      </Card>

      {!hasData ? (
        <Card className="border-dashed border-slate-200 bg-white">
          <h3 className="text-base font-semibold">Данных маркетинга пока нет</h3>
          <p className="mt-2 text-sm text-muted">Подключите рекламные источники или загрузите данные из Google Sheets/Excel, чтобы увидеть сквозную аналитику.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-emerald-50 to-white">
            <p className="text-xs text-muted">ROMI по рынку</p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-700">{rows.length ? `+${rows[0].romi}%` : "—"}</p>
            <p className="text-xs text-muted">Бенчмарк отрасли появится после загрузки данных.</p>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-50 to-white">
            <p className="text-xs text-muted">Средний CAC</p>
            <p className="mt-1 text-3xl font-extrabold text-cyan-700">{avgCac ? `${avgCac.toLocaleString("ru-RU")} ₽` : "—"}</p>
            <p className="text-xs text-muted">Цель сформируется после первых отчётов.</p>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-white">
            <p className="text-xs text-muted">Фокус недели</p>
            <p className="mt-1 text-sm font-semibold">Фокус появится после подключения источников.</p>
          </Card>
        </div>
      )}

      {hasData ? (
        <Card>
          <h3 className="mb-3 text-base font-semibold">Сквозная таблица по каналам</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="text-left text-muted">
                <tr>
                  <th className="pb-2">Канал</th>
                  <th className="pb-2">Показы</th>
                  <th className="pb-2">Клики</th>
                  <th className="pb-2">CTR</th>
                  <th className="pb-2">Лиды</th>
                  <th className="pb-2">Сделки</th>
                  <th className="pb-2">Расход</th>
                  <th className="pb-2">Выручка</th>
                  <th className="pb-2">CAC</th>
                  <th className="pb-2">ROMI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="py-2 font-medium">{row.name}</td>
                    <td className="py-2">{row.impressions.toLocaleString("ru-RU")}</td>
                    <td className="py-2">{row.clicks.toLocaleString("ru-RU")}</td>
                    <td className="py-2">{row.ctr}%</td>
                    <td className="py-2">{row.leads}</td>
                    <td className="py-2">{row.deals}</td>
                    <td className="py-2">{row.spend.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-2">{row.revenue.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-2">{row.cac.toLocaleString("ru-RU")} ₽</td>
                    <td className={`py-2 font-semibold ${row.romi < 0 ? "text-red-700" : "text-emerald-700"}`}>{row.romi}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {hasData ? (
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-base font-semibold">Воронка по источникам</h3>
          <div className="chart-shell h-64">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={180}>
                <BarChart
                  data={[
                    { stage: "Показы", value: funnel.impressions },
                    { stage: "Клики", value: funnel.clicks },
                    { stage: "Лиды", value: funnel.leads },
                    { stage: "Сделки", value: funnel.deals }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number | string | undefined) => Number(value ?? 0).toLocaleString("ru-RU")} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton h-full w-full" />
            )}
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-base font-semibold">Юнит-экономика маркетинга</h3>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-border p-3">Средний CAC: {avgCac.toLocaleString("ru-RU")} ₽</div>
            <div className="rounded-xl border border-border p-3">Средний LTV: {avgLtv ? `${avgLtv.toLocaleString("ru-RU")} ₽` : "—"}</div>
            <div className="rounded-xl border border-border p-3">Окупаемость клиента: {avgCac ? `${Math.ceil(avgCac / 900)} мес.` : "—"}</div>
          </div>
        </Card>
      </div>
      ) : null}

      {hasData ? (
        <Card>
          <h3 className="mb-3 text-base font-semibold">Сравнение расхода и выручки по каналам</h3>
          <div className="chart-shell h-72">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={180}>
                <BarChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number | string | undefined) => `${Number(value ?? 0).toLocaleString("ru-RU")} ₽`} />
                  <Legend />
                  <Bar dataKey="spend" name="Расход" fill="#fb7185" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="revenue" name="Выручка" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton h-full w-full" />
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
