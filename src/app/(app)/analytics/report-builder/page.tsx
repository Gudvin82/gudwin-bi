"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type MetricId = "revenue" | "spend" | "profit" | "leads" | "deals" | "avg_check" | "conversion" | "romi";
type DatasetId = "sales" | "marketing" | "finance";
type GroupId = "day" | "week" | "month" | "channel" | "product" | "manager";
type PeriodId = "7d" | "30d" | "90d" | "365d";
type ChartId = "table" | "line" | "bar";

const metricLabels: Record<MetricId, string> = {
  revenue: "Выручка",
  spend: "Расходы",
  profit: "Прибыль",
  leads: "Лиды",
  deals: "Сделки",
  avg_check: "Средний чек",
  conversion: "Конверсия, %",
  romi: "ROMI, %"
};

const datasetLabels: Record<DatasetId, string> = {
  sales: "Продажи",
  marketing: "Маркетинг",
  finance: "Финансы"
};

const groupLabels: Record<GroupId, string> = {
  day: "По дням",
  week: "По неделям",
  month: "По месяцам",
  channel: "По каналам",
  product: "По продуктам",
  manager: "По менеджерам"
};

const periodLabels: Record<PeriodId, string> = {
  "7d": "7 дней",
  "30d": "30 дней",
  "90d": "90 дней",
  "365d": "12 месяцев"
};

type PreviewResponse = {
  columns: string[];
  rows: Array<Record<string, string | number>>;
  totals: Record<string, number>;
  meta: { dataset: string; period: string; groupBy: string; records: number };
};

export default function ReportBuilderPage() {
  const [name, setName] = useState("Еженедельный отчёт собственника");
  const [dataset, setDataset] = useState<DatasetId>("finance");
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [groupBy, setGroupBy] = useState<GroupId>("week");
  const [metrics, setMetrics] = useState<MetricId[]>(["revenue", "profit", "romi"]);
  const [chartType, setChartType] = useState<ChartId>("line");
  const [channel, setChannel] = useState("telegram");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMetric = (id: MetricId) => {
    setMetrics((prev) => {
      if (prev.includes(id)) {
        return prev.length === 1 ? prev : prev.filter((x) => x !== id);
      }
      if (prev.length >= 6) return prev;
      return [...prev, id];
    });
  };

  const buildPreview = async () => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/report-builder/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset, period, groupBy, metrics })
    });
    if (!res.ok) {
      setStatus("Не удалось построить отчёт. Проверьте параметры и попробуйте снова.");
      setLoading(false);
      return;
    }
    const json = (await res.json()) as PreviewResponse;
    setPreview(json);
    setLoading(false);
  };

  const saveTemplate = async () => {
    const prompt = `dataset=${dataset}; period=${period}; groupBy=${groupBy}; metrics=${metrics.join(",")}; chart=${chartType}`;
    const res = await fetch("/api/report-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        prompt,
        datasetIds: [dataset],
        channels: [channel]
      })
    });
    setStatus(res.ok ? "Шаблон отчёта сохранён." : "Не удалось сохранить шаблон.");
  };

  const chartMetric = useMemo<MetricId>(() => {
    const priority: MetricId[] = ["revenue", "profit", "spend", "deals", "leads", "romi", "conversion", "avg_check"];
    return priority.find((id) => metrics.includes(id)) ?? metrics[0];
  }, [metrics]);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 via-cyan-50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Конструктор отчётов</h2>
            <p className="text-sm text-muted">
              Соберите любой управленческий отчёт из доступных метрик: период, разрез, набор показателей, формат визуализации.
            </p>
          </div>
          <HelpPopover
            title="Логика конструктора"
            items={[
              "1) Выбираете данные, период и разрез.",
              "2) Отмечаете любые нужные метрики (до 6).",
              "3) Получаете предпросмотр в таблице и графике.",
              "4) Сохраняете шаблон под Telegram/SMS/Web."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Параметры отчёта</h3>
          <div className="space-y-3">
            <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm" placeholder="Название отчёта" />
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={dataset} onChange={(event) => setDataset(event.target.value as DatasetId)} className="rounded-xl border border-border p-2.5 text-sm">
                {(Object.keys(datasetLabels) as DatasetId[]).map((item) => (
                  <option key={item} value={item}>
                    {datasetLabels[item]}
                  </option>
                ))}
              </select>
              <select value={period} onChange={(event) => setPeriod(event.target.value as PeriodId)} className="rounded-xl border border-border p-2.5 text-sm">
                {(Object.keys(periodLabels) as PeriodId[]).map((item) => (
                  <option key={item} value={item}>
                    {periodLabels[item]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={groupBy} onChange={(event) => setGroupBy(event.target.value as GroupId)} className="rounded-xl border border-border p-2.5 text-sm">
                {(Object.keys(groupLabels) as GroupId[]).map((item) => (
                  <option key={item} value={item}>
                    {groupLabels[item]}
                  </option>
                ))}
              </select>
              <select value={chartType} onChange={(event) => setChartType(event.target.value as ChartId)} className="rounded-xl border border-border p-2.5 text-sm">
                <option value="line">Линейный график</option>
                <option value="bar">Столбчатый график</option>
                <option value="table">Только таблица</option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Метрики отчёта</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(metricLabels) as MetricId[]).map((id) => (
                  <label key={id} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white p-2 text-sm">
                    <input type="checkbox" checked={metrics.includes(id)} onChange={() => toggleMetric(id)} />
                    {metricLabels[id]}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <select value={channel} onChange={(event) => setChannel(event.target.value)} className="rounded-xl border border-border p-2.5 text-sm">
                <option value="telegram">Telegram</option>
                <option value="sms">SMS</option>
                <option value="web">Web</option>
              </select>
              <button onClick={buildPreview} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
                {loading ? "Строим..." : "Построить отчёт"}
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold">Предпросмотр</h3>
              <span className="text-xs text-muted">
                {datasetLabels[dataset]} • {periodLabels[period]} • {groupLabels[groupBy]}
              </span>
            </div>
            {!preview ? (
              <p className="text-sm text-muted">Нажмите «Построить отчёт», чтобы увидеть таблицу и график.</p>
            ) : (
              <div className="space-y-4">
                {chartType !== "table" ? (
                  <div className="h-64 rounded-xl border border-border bg-white p-2">
                    {!mounted ? (
                      <div className="skeleton h-full w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={180}>
                        {chartType === "line" ? (
                          <AreaChart data={preview.rows}>
                            <defs>
                              <linearGradient id="rb" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.32} />
                                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.04} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value: number | string | undefined) => Number(value ?? 0).toLocaleString("ru-RU")} />
                            <Area type="monotone" dataKey={chartMetric} stroke="#0891b2" fill="url(#rb)" strokeWidth={2} />
                          </AreaChart>
                        ) : (
                          <BarChart data={preview.rows}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value: number | string | undefined) => Number(value ?? 0).toLocaleString("ru-RU")} />
                            <Bar dataKey={chartMetric} fill="#0f766e" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>
                ) : null}

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs text-muted">
                      <tr>
                        {preview.columns.map((column) => (
                          <th key={column} className="px-3 py-2">
                            {column === "dimension" ? "Разрез" : metricLabels[column as MetricId] ?? column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.slice(0, 40).map((row, idx) => (
                        <tr key={`row-${idx}`} className="border-t border-border">
                          {preview.columns.map((column) => (
                            <td key={`${column}-${idx}`} className="px-3 py-2">
                              {typeof row[column] === "number" ? Number(row[column]).toLocaleString("ru-RU") : String(row[column] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-2 text-base font-semibold">Итоги и публикация</h3>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted">Выручка</p>
                <p className="font-bold">{preview?.totals?.revenue?.toLocaleString("ru-RU") ?? "--"} ₽</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted">Прибыль</p>
                <p className="font-bold">{preview?.totals?.profit?.toLocaleString("ru-RU") ?? "--"} ₽</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted">ROMI</p>
                <p className="font-bold">{preview?.totals?.romi?.toLocaleString("ru-RU") ?? "--"}%</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={saveTemplate} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
                Сохранить как шаблон
              </button>
              <button className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Отправить в {channel.toUpperCase()}</button>
            </div>
            {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
