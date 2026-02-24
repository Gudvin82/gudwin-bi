"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Boxes, Link2, PlayCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Workflow = {
  id: string;
  name: string;
  status: "active" | "inactive";
  definition: {
    trigger: {
      type: "schedule" | "metric_threshold" | "event";
      schedule?: "daily" | "weekly" | "monthly";
      metric?: string;
      operator?: ">" | "<" | "=";
      value?: number;
      event?: string;
    };
    conditions: Array<{
      type: "metric";
      metric: string;
      operator: ">" | "<" | "=";
      value: number;
    }>;
    actions: Array<{
      type: "notify" | "create_task" | "run_agent" | "integration";
      description: string;
    }>;
  };
  lastRunAt: string;
};

type WorkflowLog = {
  id: string;
  workflowId: string;
  status: "success" | "error";
  message: string;
  createdAt: string;
};

type IntegrationRef = {
  id: string;
  type: string;
  status: "active" | "error" | "draft";
};

const triggerBlocks = ["По расписанию", "При изменении метрики", "При событии"];
const conditionBlocks = ["Health Score < 70", "ROMI < 20%", "Cash Guard < 7 дней"];
const actionBlocks = ["Отправить уведомление", "Создать задачу", "Запустить AI-агента"];

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationRef[]>([]);
  const [name, setName] = useState("Новый сценарий");
  const [triggerType, setTriggerType] = useState<"schedule" | "metric_threshold" | "event">("metric_threshold");
  const [metric, setMetric] = useState("health_score");
  const [operator, setOperator] = useState<">" | "<" | "=">("<");
  const [value, setValue] = useState(70);
  const [actionDescription, setActionDescription] = useState("Отправить уведомление владельцу и создать задачу");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/workflows");
    const json = (await res.json()) as {
      workflows: Workflow[];
      logs: WorkflowLog[];
      integrations: IntegrationRef[];
    };
    setWorkflows(json.workflows ?? []);
    setLogs(json.logs ?? []);
    setIntegrations(json.integrations ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const createWorkflow = async () => {
    setLoading(true);
    try {
      await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          triggerType,
          metric,
          operator,
          value,
          actionType: "run_agent",
          actionDescription
        })
      });
      await load();
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflow = async (id: string) => {
    await fetch(`/api/workflows/${id}/toggle`, { method: "POST" });
    await load();
  };

  const scenarioPreview = useMemo(() => {
    if (triggerType === "schedule") return "Когда: по расписанию";
    if (triggerType === "event") return "Когда: при событии";
    return `Когда: ${metric} ${operator} ${value}`;
  }, [metric, operator, triggerType, value]);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-violet-50 via-sky-50 to-cyan-50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Сценарии и агенты</h2>
            <p className="mt-1 text-sm text-muted">Собирайте автоматизации кубиками: «Когда → Если → Сделать» и запускайте AI-агентов.</p>
          </div>
          <HelpPopover
            title="Как работает конструктор"
            items={[
              "Выберите триггер, затем условие и действие.",
              "Сохраните сценарий и включите его переключателем.",
              "Проверяйте журнал срабатываний ниже."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.3fr]">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Boxes size={16} />
            Палитра кубиков
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Триггеры</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {triggerBlocks.map((item) => (
                  <div key={item} className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-cyan-800">{item}</div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Условия</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {conditionBlocks.map((item) => (
                  <div key={item} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">{item}</div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Действия</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {actionBlocks.map((item) => (
                  <div key={item} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">{item}</div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Интеграции</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {integrations.map((item) => (
                  <div key={item.id} className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-800">
                    {item.type} • {item.status}
                  </div>
                ))}
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-slate-600">+ Ещё не подключено</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Визуальный сценарий</h3>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-900">{scenarioPreview}</div>
              <ArrowRight className="hidden text-slate-400 sm:block" size={16} />
              <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">Если: health_score &lt; 70</div>
              <ArrowRight className="hidden text-slate-400 sm:block" size={16} />
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                Сделать: {actionDescription}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Название сценария</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Триггер</span>
              <select
                value={triggerType}
                onChange={(event) => setTriggerType(event.target.value as "schedule" | "metric_threshold" | "event")}
                className="w-full rounded-xl border border-slate-200 p-2"
              >
                <option value="metric_threshold">При изменении метрики</option>
                <option value="schedule">По расписанию</option>
                <option value="event">При событии</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Метрика</span>
              <input value={metric} onChange={(event) => setMetric(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Порог</span>
              <div className="flex gap-2">
                <select value={operator} onChange={(event) => setOperator(event.target.value as ">" | "<" | "=")} className="rounded-xl border border-slate-200 p-2">
                  <option value="<">{"<"}</option>
                  <option value=">">{">"}</option>
                  <option value="=">{"="}</option>
                </select>
                <input
                  value={value}
                  onChange={(event) => setValue(Number(event.target.value))}
                  type="number"
                  className="w-full rounded-xl border border-slate-200 p-2"
                />
              </div>
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted">Действие</span>
              <input value={actionDescription} onChange={(event) => setActionDescription(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
          </div>

          <button
            onClick={createWorkflow}
            disabled={loading}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            {loading ? "Сохраняем..." : "Создать сценарий"}
          </button>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Сценарии</h3>
          <div className="space-y-2">
            {workflows.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">Последний запуск: {new Date(item.lastRunAt).toLocaleString("ru-RU")}</p>
                  </div>
                  <button
                    onClick={() => toggleWorkflow(item.id)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold ${item.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    {item.status === "active" ? "Активен" : "Выключен"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <PlayCircle size={16} />
            Логи срабатываний
          </h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold">{log.status === "success" ? "Успешно" : "Ошибка"}</p>
                <p className="text-sm text-muted">{log.message}</p>
                <p className="mt-1 text-xs text-muted">{new Date(log.createdAt).toLocaleString("ru-RU")}</p>
              </div>
            ))}
            {logs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-muted">
                Логи появятся после первого срабатывания сценария.
              </div>
            ) : null}
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold">Pro-режим</p>
            <p className="mt-1 text-xs text-muted">Расширенные HTTP/webhook блоки и сложные ветвления доступны как следующий этап.</p>
            <button className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              <Link2 size={14} />
              Заказать расширенную автоматизацию
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
