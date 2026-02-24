"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type WidgetType = "kpi" | "line" | "bar" | "table";

type DraftWidget = {
  id: string;
  name: string;
  type: WidgetType;
  metric: string;
};

const metricOptions = ["Выручка", "Маржа", "ROMI", "LTV/CAC", "Лиды", "Конверсия", "Дебиторка"];

export default function DashboardBuilderPage() {
  const [dashboardName, setDashboardName] = useState("Панель владельца");
  const [widgetName, setWidgetName] = useState("Динамика выручки");
  const [widgetType, setWidgetType] = useState<WidgetType>("line");
  const [metric, setMetric] = useState(metricOptions[0]);
  const [widgets, setWidgets] = useState<DraftWidget[]>([
    { id: "w1", name: "Индекс здоровья", type: "kpi", metric: "Health Score" }
  ]);
  const [status, setStatus] = useState("");

  const addWidget = () => {
    const id = `w${Date.now()}`;
    setWidgets((prev) => [...prev, { id, name: widgetName, type: widgetType, metric }]);
    setStatus("Виджет добавлен в черновик.");
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((item) => item.id !== id));
    setStatus("Виджет удален из черновика.");
  };

  const summary = useMemo(() => {
    const byType = widgets.reduce<Record<string, number>>((acc, widget) => {
      acc[widget.type] = (acc[widget.type] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(byType)
      .map(([type, count]) => `${type}: ${count}`)
      .join(" • ");
  }, [widgets]);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-sky-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Конструктор дашбордов</h2>
            <p className="text-sm text-muted">Соберите свой экран из KPI, графиков и таблиц без ручного кодинга.</p>
          </div>
          <HelpPopover
            title="Как собрать дашборд"
            items={[
              "Укажите название панели.",
              "Добавьте нужные виджеты и метрики.",
              "Сохраните черновик и вернитесь к нему позже."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Параметры панели</h3>
          <div className="space-y-2">
            <input
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full rounded-xl border border-border p-2 text-sm"
              placeholder="Название дашборда"
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                className="rounded-xl border border-border p-2 text-sm sm:col-span-2"
                placeholder="Название виджета"
              />
              <select value={widgetType} onChange={(e) => setWidgetType(e.target.value as WidgetType)} className="rounded-xl border border-border p-2 text-sm">
                <option value="kpi">KPI</option>
                <option value="line">Линия</option>
                <option value="bar">Столбцы</option>
                <option value="table">Таблица</option>
              </select>
            </div>
            <select value={metric} onChange={(e) => setMetric(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm">
              {metricOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={addWidget} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Добавить виджет</button>
            <button onClick={() => setStatus("Черновик сохранен локально.")} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Сохранить черновик</button>
          </div>
          {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
        </Card>

        <Card>
          <h3 className="mb-1 text-base font-semibold">Предпросмотр: {dashboardName}</h3>
          <p className="mb-3 text-xs text-muted">Состав: {summary || "виджеты не добавлены"}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {widgets.map((widget) => (
              <div key={widget.id} className="rounded-xl border border-border bg-white p-3">
                <p className="text-xs text-muted">{widget.type.toUpperCase()}</p>
                <p className="text-sm font-semibold">{widget.name}</p>
                <p className="text-xs text-muted">Метрика: {widget.metric}</p>
                <button onClick={() => removeWidget(widget.id)} className="mt-2 rounded-lg border border-border px-2 py-1 text-xs">
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
