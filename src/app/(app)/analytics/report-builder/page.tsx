"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";
import { filterFields, filterOperators, metricCatalog, metricGroups } from "@/lib/metrics-catalog";

type MetricId = string;
type DatasetId = "sales" | "marketing" | "finance";
type GroupId = "day" | "week" | "month" | "channel" | "product" | "manager";
type PeriodId = "7d" | "30d" | "90d" | "365d";
type ChartId = "table" | "line" | "bar";

const metricLabels = metricCatalog.reduce<Record<string, string>>((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

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

type FilterRow = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

type ReportTemplate = {
  id: string;
  name: string;
  dataset: DatasetId;
  period: PeriodId;
  groupBy: GroupId;
  metrics: MetricId[];
  chartType: ChartId;
  filters: FilterRow[];
};

const emptyFilter = (): FilterRow => ({
  id: crypto.randomUUID(),
  field: filterFields[0].id,
  operator: filterOperators[0],
  value: ""
});

export default function ReportBuilderPage() {
  const [name, setName] = useState("Еженедельный отчёт собственника");
  const [dataset, setDataset] = useState<DatasetId>("finance");
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [groupBy, setGroupBy] = useState<GroupId>("week");
  const [metrics, setMetrics] = useState<MetricId[]>(["revenue", "profit", "romi"]);
  const [chartType, setChartType] = useState<ChartId>("line");
  const [channel, setChannel] = useState("telegram");
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [time, setTime] = useState("09:00");
  const [dayOfWeek, setDayOfWeek] = useState("mon");
  const [dayOfMonth, setDayOfMonth] = useState(5);
  const [recipients, setRecipients] = useState("owner@gudwin.bi");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<FilterRow[]>([emptyFilter()]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  const storeKey = "gudwin.report.templates";

  function loadTemplates() {
    const raw = localStorage.getItem(storeKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ReportTemplate[];
      setTemplates(parsed);
    } catch {
      setTemplates([]);
    }
  }

  useEffect(() => {
    setMounted(true);
    loadTemplates();
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
      body: JSON.stringify({ dataset, period, groupBy, metrics, filters })
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
    const localTemplate: ReportTemplate = {
      id: crypto.randomUUID(),
      name,
      dataset,
      period,
      groupBy,
      metrics,
      chartType,
      filters
    };
    const nextTemplates = [localTemplate, ...templates];
    setTemplates(nextTemplates);
    localStorage.setItem(storeKey, JSON.stringify(nextTemplates));
    const res = await fetch("/api/report-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        prompt,
        datasetIds: [dataset],
        channels: [channel],
        recipients: recipients.split(",").map((item) => item.trim()).filter(Boolean),
        schedule: scheduleEnabled
          ? {
              frequency,
              time,
              dayOfWeek: frequency === "weekly" ? dayOfWeek : undefined,
              dayOfMonth: frequency === "monthly" ? dayOfMonth : undefined
            }
          : undefined,
        filters
      })
    });
    setStatus(res.ok ? "Шаблон отчёта сохранён." : "Не удалось сохранить шаблон.");
  };

  const exportPdf = async () => {
    await fetch("/api/export/pdf", { method: "POST" });
    window.print();
  };

  const chartMetric = useMemo<MetricId>(() => {
    const priority: MetricId[] = ["revenue", "profit", "spend", "deals", "leads", "romi", "conversion", "avg_check"];
    return priority.find((id) => metrics.includes(id)) ?? metrics[0];
  }, [metrics]);

  const addFilter = () => setFilters((prev) => [...prev, emptyFilter()]);
  const updateFilter = (id: string, next: Partial<FilterRow>) =>
    setFilters((prev) => prev.map((row) => (row.id === id ? { ...row, ...next } : row)));
  const removeFilter = (id: string) => setFilters((prev) => prev.filter((row) => row.id !== id));

  const applyTemplate = (item: ReportTemplate) => {
    setName(item.name);
    setDataset(item.dataset);
    setPeriod(item.period);
    setGroupBy(item.groupBy);
    setMetrics(item.metrics);
    setChartType(item.chartType);
    setFilters(item.filters.length ? item.filters : [emptyFilter()]);
    setStatus("Шаблон применён.");
  };

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
                {metricGroups.map((group) => (
                  <div key={group} className="rounded-xl border border-border bg-white p-2">
                    <p className="mb-2 text-xs font-semibold text-slate-500">{group}</p>
                    <div className="grid gap-2">
                      {metricCatalog.filter((item) => item.group === group).map((item) => (
                        <label key={item.id} className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={metrics.includes(item.id)} onChange={() => toggleMetric(item.id)} />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
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

            <div className="border-t border-border pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Фильтры отчёта</p>
                <button onClick={addFilter} className="text-xs font-semibold text-cyan-700">+ Добавить фильтр</button>
              </div>
              <div className="space-y-2">
                {filters.map((row) => (
                  <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_80px_1fr_auto]">
                    <select value={row.field} onChange={(e) => updateFilter(row.id, { field: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
                      {filterFields.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                    <select value={row.operator} onChange={(e) => updateFilter(row.id, { operator: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
                      {filterOperators.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                    <input
                      value={row.value}
                      onChange={(e) => updateFilter(row.id, { value: e.target.value })}
                      className="rounded-xl border border-border p-2 text-sm"
                      placeholder="Значение"
                    />
                    <button onClick={() => removeFilter(row.id)} className="rounded-xl border border-border px-2 text-xs">Удалить</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold">Шаблоны отчётов</h3>
              <button onClick={loadTemplates} className="text-xs font-semibold text-cyan-700">Обновить список</button>
            </div>
            {templates.length === 0 ? (
              <p className="text-sm text-muted">Пока нет сохранённых шаблонов. Настройте параметры и сохраните отчёт.</p>
            ) : (
              <div className="space-y-2">
                {templates.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-xl border border-border bg-white p-3">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">{datasetLabels[item.dataset]} • {periodLabels[item.period]} • {groupLabels[item.groupBy]}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button onClick={() => applyTemplate(item)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">Применить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

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
                  <div className="chart-shell h-64">
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
              <button onClick={exportPdf} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Скачать PDF</button>
            </div>
            {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
          </Card>

          <Card>
            <h3 className="mb-2 text-base font-semibold">Рассылка отчёта</h3>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <label>
                <span className="mb-1 block text-xs text-muted">Канал</span>
                <select value={channel} onChange={(event) => setChannel(event.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm">
                  <option value="telegram">Telegram</option>
                  <option value="email">Email</option>
                  <option value="web">Web</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs text-muted">Получатели</span>
                <input value={recipients} onChange={(event) => setRecipients(event.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm" placeholder="owner@gudwin.bi, cfo@company.ru" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={scheduleEnabled} onChange={(event) => setScheduleEnabled(event.target.checked)} />
                Отправлять по расписанию
              </label>
              <div />
              <label>
                <span className="mb-1 block text-xs text-muted">Частота</span>
                <select value={frequency} onChange={(event) => setFrequency(event.target.value as "daily" | "weekly" | "monthly")} className="w-full rounded-xl border border-border p-2.5 text-sm">
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                  <option value="monthly">Ежемесячно</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs text-muted">Время</span>
                <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm" />
              </label>
              {frequency === "weekly" ? (
                <label>
                  <span className="mb-1 block text-xs text-muted">День недели</span>
                  <select value={dayOfWeek} onChange={(event) => setDayOfWeek(event.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm">
                    <option value="mon">Пн</option>
                    <option value="tue">Вт</option>
                    <option value="wed">Ср</option>
                    <option value="thu">Чт</option>
                    <option value="fri">Пт</option>
                    <option value="sat">Сб</option>
                    <option value="sun">Вс</option>
                  </select>
                </label>
              ) : null}
              {frequency === "monthly" ? (
                <label>
                  <span className="mb-1 block text-xs text-muted">День месяца</span>
                  <input type="number" min={1} max={28} value={dayOfMonth} onChange={(event) => setDayOfMonth(Number(event.target.value))} className="w-full rounded-xl border border-border p-2.5 text-sm" />
                </label>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
