"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";
import { filterFields, filterOperators, metricCatalog, metricGroups } from "@/lib/metrics-catalog";
import { uid } from "@/lib/utils/uid";

type WidgetType = "kpi" | "line" | "bar" | "table";
type WidgetSize = "half" | "full";

type FilterRow = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

type DraftWidget = {
  id: string;
  name: string;
  type: WidgetType;
  metricId: string;
  size: WidgetSize;
  filters: FilterRow[];
};

type DashboardTemplate = {
  id: string;
  name: string;
  description: string;
  widgets: DraftWidget[];
  filters: FilterRow[];
};

const metricOptions = metricCatalog;

const emptyFilter = (): FilterRow => ({
  id: uid(),
  field: filterFields[0].id,
  operator: filterOperators[0],
  value: ""
});

export default function DashboardBuilderPage() {
  const [dashboardName, setDashboardName] = useState("Панель владельца");
  const [dashboardDescription, setDashboardDescription] = useState("Ежедневный контроль ключевых метрик и рисков.");
  const [widgetName, setWidgetName] = useState("Динамика выручки");
  const [widgetType, setWidgetType] = useState<WidgetType>("line");
  const [widgetSize, setWidgetSize] = useState<WidgetSize>("half");
  const [metricId, setMetricId] = useState(metricOptions[0].id);
  const [widgets, setWidgets] = useState<DraftWidget[]>([
    { id: "w1", name: "Индекс здоровья", type: "kpi", metricId: "health_score", size: "half", filters: [] }
  ]);
  const [filters, setFilters] = useState<FilterRow[]>([emptyFilter()]);
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [status, setStatus] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const metricById = useMemo(() => {
    return metricCatalog.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.label;
      return acc;
    }, {});
  }, []);

  const storeKey = "gudwin.dashboard.templates";

  function loadTemplates() {
    const raw = localStorage.getItem(storeKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DashboardTemplate[];
      setTemplates(parsed);
    } catch {
      setTemplates([]);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  const addWidget = () => {
    const id = `w${Date.now()}`;
    setWidgets((prev) => [
      ...prev,
      { id, name: widgetName, type: widgetType, metricId, size: widgetSize, filters: [] }
    ]);
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

  const addFilter = () => setFilters((prev) => [...prev, emptyFilter()]);
  const updateFilter = (id: string, next: Partial<FilterRow>) =>
    setFilters((prev) => prev.map((row) => (row.id === id ? { ...row, ...next } : row)));
  const removeFilter = (id: string) => setFilters((prev) => prev.filter((row) => row.id !== id));

  const saveTemplate = () => {
    const next: DashboardTemplate = {
      id: uid(),
      name: dashboardName,
      description: dashboardDescription,
      widgets,
      filters
    };
    const nextTemplates = [next, ...templates];
    setTemplates(nextTemplates);
    localStorage.setItem(storeKey, JSON.stringify(nextTemplates));
    setStatus("Шаблон дашборда сохранён.");
  };

  const applyTemplate = (template: DashboardTemplate) => {
    setDashboardName(template.name);
    setDashboardDescription(template.description);
    setWidgets(template.widgets);
    setFilters(template.filters.length ? template.filters : [emptyFilter()]);
    setStatus("Шаблон применён.");
  };

  const removeTemplate = (id: string) => {
    const nextTemplates = templates.filter((item) => item.id !== id);
    setTemplates(nextTemplates);
    localStorage.setItem(storeKey, JSON.stringify(nextTemplates));
  };

  const moveWidget = (from: number, to: number) => {
    setWidgets((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = widgets.findIndex((item) => item.id === dragId);
    const to = widgets.findIndex((item) => item.id === targetId);
    moveWidget(from, to);
    setDragId(null);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-sky-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Конструктор дашбордов</h2>
            <p className="text-sm text-muted">Соберите свой экран из любых метрик, фильтров и виджетов. Поддерживается сохранение и шаблоны.</p>
          </div>
          <HelpPopover
            title="Как собрать дашборд"
            items={[
              "Укажите название панели.",
              "Добавьте нужные виджеты и метрики.",
              "Настройте фильтры и порядок, затем сохраните шаблон."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[460px_1fr]">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Параметры панели</h3>
          <div className="space-y-2">
            <input
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full rounded-xl border border-border p-2 text-sm"
              placeholder="Название дашборда"
            />
            <textarea
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              className="w-full rounded-xl border border-border p-2 text-sm"
              rows={2}
              placeholder="Короткое описание панели"
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
            <div className="grid gap-2 sm:grid-cols-3">
              <select value={metricId} onChange={(e) => setMetricId(e.target.value)} className="rounded-xl border border-border p-2 text-sm sm:col-span-2">
                {metricGroups.map((group) => (
                  <optgroup key={group} label={group}>
                    {metricOptions.filter((item) => item.group === group).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select value={widgetSize} onChange={(e) => setWidgetSize(e.target.value as WidgetSize)} className="rounded-xl border border-border p-2 text-sm">
                <option value="half">1/2 ширины</option>
                <option value="full">1/1 ширины</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={addWidget} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Добавить виджет</button>
            <button onClick={saveTemplate} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Сохранить шаблон</button>
            <button onClick={() => setStatus("Черновик сохранён локально.")} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Сохранить черновик</button>
          </div>
          {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}

          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Фильтры панели</p>
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
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold">Шаблоны дашбордов</h3>
            <button onClick={loadTemplates} className="text-xs font-semibold text-cyan-700">Обновить список</button>
          </div>
          {templates.length === 0 ? (
            <p className="text-sm text-muted">Пока нет сохранённых шаблонов. Создайте дашборд и сохраните его.</p>
          ) : (
            <div className="space-y-2">
              {templates.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-white p-3">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => applyTemplate(item)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">Применить</button>
                    <button onClick={() => removeTemplate(item.id)} className="rounded-lg border border-border px-3 py-1.5 text-xs">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-1 text-base font-semibold">Предпросмотр: {dashboardName}</h3>
        <p className="mb-3 text-xs text-muted">Состав: {summary || "виджеты не добавлены"} • Перетащите карточки, чтобы изменить порядок.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {widgets.map((widget, idx) => (
            <div
              key={widget.id}
              draggable
              onDragStart={() => handleDragStart(widget.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(widget.id)}
              className={`rounded-2xl border border-border bg-white p-4 shadow-sm ${widget.size === "full" ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">{widget.type.toUpperCase()}</p>
                  <p className="text-sm font-semibold">{widget.name}</p>
                  <p className="text-xs text-muted">Метрика: {metricById[widget.metricId] ?? widget.metricId}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveWidget(idx, idx - 1)} className="rounded-lg border border-border px-2 py-1 text-xs">↑</button>
                  <button onClick={() => moveWidget(idx, idx + 1)} className="rounded-lg border border-border px-2 py-1 text-xs">↓</button>
                </div>
              </div>
              {widget.filters.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {widget.filters.map((filter) => (
                    <span key={filter.id} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                      {filter.field} {filter.operator} {filter.value}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted">Фильтры не заданы.</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => removeWidget(widget.id)} className="rounded-lg border border-border px-2 py-1 text-xs">
                  Удалить
                </button>
                <button onClick={() => setStatus(`Открыта настройка виджета «${widget.name}».`)} className="rounded-lg border border-border px-2 py-1 text-xs">
                  Настроить
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
