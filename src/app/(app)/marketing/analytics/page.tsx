"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/analytics");
      const json = await res.json();
      setRows(json.rows ?? []);
    };
    void load();
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

  const avgCac = useMemo(() => (rows.length ? Math.round(rows.reduce((acc, item) => acc + item.cac, 0) / rows.length) : 0), [rows]);
  const avgLtv = 6200;

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

      <Card>
        <h3 className="mb-3 text-base font-semibold">Сквозная таблица по каналам</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-base font-semibold">Воронка по источникам</h3>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-border p-3">Показы: {funnel.impressions.toLocaleString("ru-RU")}</div>
            <div className="rounded-xl border border-border p-3">Клики: {funnel.clicks.toLocaleString("ru-RU")}</div>
            <div className="rounded-xl border border-border p-3">Лиды: {funnel.leads.toLocaleString("ru-RU")}</div>
            <div className="rounded-xl border border-border p-3">Сделки: {funnel.deals.toLocaleString("ru-RU")}</div>
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-base font-semibold">Юнит-экономика маркетинга</h3>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-border p-3">Средний CAC: {avgCac.toLocaleString("ru-RU")} ₽</div>
            <div className="rounded-xl border border-border p-3">Средний LTV: {avgLtv.toLocaleString("ru-RU")} ₽</div>
            <div className="rounded-xl border border-border p-3">Окупаемость клиента: {Math.ceil(avgCac / 900)} мес.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
