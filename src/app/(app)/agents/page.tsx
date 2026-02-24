"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Agent = {
  id: string;
  type: "support" | "hr" | "sales" | "marketing" | "custom";
  name: string;
  description: string;
  status: "active" | "paused";
  config_json: Record<string, unknown>;
};

type AgentLog = {
  id: string;
  timestamp: string;
  eventType: string;
  message: string;
};

const presets: Array<{ type: Agent["type"]; label: string; description: string }> = [
  { type: "support", label: "Агент поддержки", description: "SLA, категории обращений, точки эскалации" },
  { type: "hr", label: "HR-агент", description: "Нагрузка, смены, риски выгорания" },
  { type: "sales", label: "Агент продаж", description: "Потерянные лиды, follow-up, прогноз закрытия" },
  { type: "marketing", label: "Агент маркетинга", description: "ROMI, CAC, аномалии каналов" },
  { type: "custom", label: "Свой агент", description: "Кастомный сценарий под задачу бизнеса" }
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [newAgentType, setNewAgentType] = useState<Agent["type"]>("support");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/agents");
      const json = (await res.json()) as { agents: Agent[] };
      setAgents(json.agents);
      if (json.agents[0]) {
        setActiveAgentId(json.agents[0].id);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!activeAgentId) {
      return;
    }
    const loadLogs = async () => {
      const res = await fetch(`/api/agents/${activeAgentId}/logs`);
      const json = (await res.json()) as { logs: AgentLog[] };
      setLogs(json.logs);
    };
    void loadLogs();
  }, [activeAgentId]);

  const createAgent = async () => {
    const preset = presets.find((item) => item.type === newAgentType);
    if (!preset) {
      return;
    }

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: preset.type,
        name: preset.label,
        description: preset.description,
        config_json: { step2_data_access: ["datasets", "crm"], step3_tasks: ["daily report"] }
      })
    });

    if (!res.ok) {
      return;
    }

    const json = (await res.json()) as { agent: Agent };
    setAgents((prev) => [json.agent, ...prev]);
    setActiveAgentId(json.agent.id);
  };

  const runTask = async () => {
    if (!activeAgentId) {
      return;
    }

    const res = await fetch(`/api/agents/${activeAgentId}/run-task`, { method: "POST" });
    if (!res.ok) {
      return;
    }

    const json = (await res.json()) as { log: AgentLog };
    setLogs((prev) => [json.log, ...prev]);
  };

  const activeAgent = agents.find((item) => item.id === activeAgentId) ?? null;

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up">
        <h2 className="mb-2 text-xl font-bold">AI-агенты</h2>
        <p className="text-sm text-muted">Платформа для OpenClaw-агентов: поддержка, HR, продажи, маркетинг и кастомные сценарии.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        {presets.map((preset) => (
          <button
            key={preset.type}
            onClick={() => setNewAgentType(preset.type)}
            className={`rounded-2xl border p-4 text-left ${newAgentType === preset.type ? "border-accent bg-accentSoft" : "border-border bg-card"}`}
          >
            <p className="mb-1 text-sm font-semibold">{preset.label}</p>
            <p className="text-xs text-muted">{preset.description}</p>
          </button>
        ))}
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Мастер создания агента (3 шага)</h3>
        <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>Выберите тип агента или кастомный шаблон.</li>
          <li>Настройте доступы к данным (datasets/CRM/Telegram).</li>
          <li>Определите задачи и расписания.</li>
        </ol>
        <button onClick={createAgent} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
          Создать нового агента
        </button>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Агенты workspace</h3>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setActiveAgentId(agent.id)}
                className={`w-full rounded-xl border p-3 text-left ${activeAgentId === agent.id ? "border-accent bg-accentSoft" : "border-border"}`}
              >
                <p className="font-semibold">{agent.name}</p>
                <p className="text-xs text-muted">{agent.description}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          {activeAgent ? (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{activeAgent.name}</h3>
                  <p className="text-sm text-muted">{activeAgent.description}</p>
                </div>
                <button onClick={runTask} className="rounded-xl border border-border px-3 py-2 text-sm">
                  Запустить задачу
                </button>
              </div>

              <div className="mb-3 rounded-xl border border-border p-3 text-sm">
                <p className="text-xs text-muted">Настройки агента</p>
                <pre className="mt-2 overflow-x-auto text-xs">{JSON.stringify(activeAgent.config_json, null, 2)}</pre>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Логи действий</p>
                {logs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-semibold">{log.eventType}</p>
                    <p className="text-muted">{log.message}</p>
                    <p className="text-xs text-muted">{new Date(log.timestamp).toLocaleString("ru-RU")}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Выберите агента слева.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
