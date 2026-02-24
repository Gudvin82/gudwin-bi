"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flag, Sparkles, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type GoalTask = {
  id: string;
  title: string;
  integration: "bitrix24" | "amocrm" | "internal";
  status: "todo" | "in_progress" | "done";
};

type Goal = {
  id: string;
  title: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  unit: "%" | "₽" | "шт" | "дн";
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "paused" | "achieved";
  requiredData: string[];
  missingData: string[];
  aiSummary: string;
  aiPlan: string[];
  tasks: GoalTask[];
  updatedAt: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("Увеличить маржу");
  const [targetMetric, setTargetMetric] = useState("Маржа");
  const [targetValue, setTargetValue] = useState(35);
  const [currentValue, setCurrentValue] = useState(27);
  const [unit, setUnit] = useState<"%" | "₽" | "шт" | "дн">("%");
  const [deadline, setDeadline] = useState("2026-05-01");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const res = await fetch("/api/goals");
    const json = (await res.json()) as { goals: Goal[] };
    setGoals(json.goals ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const createGoal = async () => {
    setCreating(true);
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, targetMetric, targetValue, currentValue, unit, deadline })
      });
      await load();
    } finally {
      setCreating(false);
    }
  };

  const updateTaskStatus = async (goalId: string, taskId: string, status: "todo" | "in_progress" | "done") => {
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId, taskId, status })
    });
    await load();
  };

  const activeGoals = useMemo(() => goals.filter((goal) => goal.status === "active"), [goals]);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-emerald-50 via-cyan-50 to-sky-50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Цели и план достижения</h2>
            <p className="mt-1 text-sm text-muted">Метод от обратного: задайте целевые метрики, а система подскажет чего не хватает и построит AI-план.</p>
          </div>
          <HelpPopover
            title="Как работает раздел целей"
            items={[
              "Сформулируйте цель и целевую метрику.",
              "Система проверит, хватает ли данных для расчета.",
              "AI сформирует шаги и передаст задачи в интеграции."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.3fr]">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Target size={16} />
            Новая цель
          </h3>
          <div className="grid gap-2 text-sm">
            <label>
              <span className="mb-1 block text-xs text-muted">Название цели</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
            <label>
              <span className="mb-1 block text-xs text-muted">Ключевая метрика</span>
              <input value={targetMetric} onChange={(event) => setTargetMetric(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              <label>
                <span className="mb-1 block text-xs text-muted">Текущий факт</span>
                <input value={currentValue} onChange={(event) => setCurrentValue(Number(event.target.value))} type="number" className="w-full rounded-xl border border-slate-200 p-2" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-muted">Цель</span>
                <input value={targetValue} onChange={(event) => setTargetValue(Number(event.target.value))} type="number" className="w-full rounded-xl border border-slate-200 p-2" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-muted">Ед.</span>
                <select value={unit} onChange={(event) => setUnit(event.target.value as "%" | "₽" | "шт" | "дн")} className="w-full rounded-xl border border-slate-200 p-2">
                  <option value="%">%</option>
                  <option value="₽">₽</option>
                  <option value="шт">шт</option>
                  <option value="дн">дн</option>
                </select>
              </label>
            </div>
            <label>
              <span className="mb-1 block text-xs text-muted">Срок</span>
              <input value={deadline} onChange={(event) => setDeadline(event.target.value)} type="date" className="w-full rounded-xl border border-slate-200 p-2" />
            </label>
          </div>
          <button
            onClick={createGoal}
            disabled={creating}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Flag size={16} />
            {creating ? "Считаем..." : "Сформировать AI-план"}
          </button>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Цели в работе</h3>
          <div className="space-y-3">
            {activeGoals.map((goal) => {
              const progress = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
              const hasMissingData = goal.missingData.length > 0;
              return (
                <div key={goal.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{goal.title}</p>
                      <p className="text-xs text-muted">
                        {goal.targetMetric}: {goal.currentValue} / {goal.targetValue} {goal.unit} • дедлайн {new Date(goal.deadline).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{progress}%</span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">AI-вывод</p>
                    <p className="mt-1 text-sm text-slate-700">{goal.aiSummary}</p>
                    {hasMissingData ? (
                      <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                        Не хватает данных: {goal.missingData.join(", ")}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
                        Данных достаточно для точного плана.
                      </div>
                    )}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                      {goal.aiPlan.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 grid gap-2 lg:grid-cols-2">
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="rounded-xl border border-slate-200 p-2">
                        <p className="text-xs font-semibold">{task.title}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-muted">Интеграция: {task.integration}</span>
                          <select
                            value={task.status}
                            onChange={(event) => updateTaskStatus(goal.id, task.id, event.target.value as "todo" | "in_progress" | "done")}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                          >
                            <option value="todo">К выполнению</option>
                            <option value="in_progress">В работе</option>
                            <option value="done">Готово</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-white to-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Следующий шаг по целям</p>
            <p className="text-xs text-muted">Передайте задачи в CRM или настройте автосценарий по KPI.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/automation" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold">
              Создать сценарий из цели
            </Link>
            <Link href="/integrations" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold">
              Подключить Bitrix24 / amoCRM
            </Link>
            <button className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700">
              <Sparkles size={14} />
              Уточнить план у AI
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
