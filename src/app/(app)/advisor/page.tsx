"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

type AdvisorRole = "business" | "accountant" | "financier";

type SessionItem = { id: string; title: string; role: AdvisorRole; createdAt: string };

type AssistantBlock = {
  summary: string;
  insights: string[];
  recommendations: string[];
  risk_flags: string[];
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  structured?: AssistantBlock;
};

const roleMeta: Record<AdvisorRole, { label: string; avatar: string; placeholder: string }> = {
  business: {
    label: "Бизнес-консультант",
    avatar: "🧠",
    placeholder: "Проанализируй выручку и расходы за 3 месяца и предложи план оптимизации"
  },
  accountant: {
    label: "AI-бухгалтер",
    avatar: "📘",
    placeholder: "Проверь риски по налогам и закрытию месяца, что критично сделать в первую очередь"
  },
  financier: {
    label: "AI-финансист",
    avatar: "📊",
    placeholder: "Сделай cash flow прогноз на 3 месяца и дай сценарии best/base/worst"
  }
};

export default function AdvisorPage() {
  const [role, setRole] = useState<AdvisorRole>("business");
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<{ kpi?: Record<string, number>; dataSources?: string[]; warnings?: string[] }>({});
  const [input, setInput] = useState(roleMeta.business.placeholder);
  const [loading, setLoading] = useState(false);

  const activeSession = useMemo(() => sessions.find((item) => item.id === activeSessionId) ?? null, [sessions, activeSessionId]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/advisor/sessions");
      const json = (await res.json()) as { sessions: SessionItem[] };
      setSessions(json.sessions);
      if (json.sessions[0]) {
        setActiveSessionId(json.sessions[0].id);
      }
    };

    void load();
  }, []);

  const createSession = async () => {
    const title = `Новая тема: ${roleMeta[role].label}`;
    const res = await fetch("/api/advisor/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, title })
    });

    if (!res.ok) {
      return;
    }

    const json = (await res.json()) as { session: SessionItem };
    setSessions((prev) => [json.session, ...prev]);
    setActiveSessionId(json.session.id);
    setMessages([]);
  };

  const askAdvisor = async () => {
    if (!input.trim()) {
      return;
    }

    setLoading(true);
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/advisor/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, message: input, sessionId: activeSessionId ?? undefined })
    });

    if (!res.ok) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: "Ошибка запроса к консультанту. Попробуйте снова." }]);
      setLoading(false);
      return;
    }

    const json = (await res.json()) as AssistantBlock & { context?: { kpi?: Record<string, number>; dataSources?: string[]; warnings?: string[] } };
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: json.summary,
        structured: {
          summary: json.summary,
          insights: json.insights,
          recommendations: json.recommendations,
          risk_flags: json.risk_flags
        }
      }
    ]);
    setContext(json.context ?? {});
    setInput("");
    setLoading(false);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
      <Card className="animate-fade-up">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">Сессии</h2>
          <button onClick={createSession} className="rounded-lg border border-border px-2 py-1 text-xs">
            + Новая
          </button>
        </div>
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`w-full rounded-xl border p-3 text-left text-sm ${activeSessionId === session.id ? "border-accent bg-accentSoft" : "border-border"}`}
            >
              <p className="font-semibold">{session.title}</p>
              <p className="text-xs text-muted">{roleMeta[session.role].label}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="animate-fade-up">
        <div className="mb-3 flex flex-wrap gap-2">
          {(Object.keys(roleMeta) as AdvisorRole[]).map((roleId) => (
            <button
              key={roleId}
              onClick={() => {
                setRole(roleId);
                setInput(roleMeta[roleId].placeholder);
              }}
              className={`rounded-xl border px-3 py-2 text-sm ${role === roleId ? "border-accent bg-accentSoft text-accent" : "border-border text-muted"}`}
            >
              {roleMeta[roleId].avatar} {roleMeta[roleId].label}
            </button>
          ))}
        </div>

        <div className="mb-4 max-h-[520px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-slate-50 p-3">
          {messages.length === 0 ? <p className="text-sm text-muted">Задайте первый вопрос консультанту по вашему бизнесу.</p> : null}
          {messages.map((message) => (
            <div key={message.id} className={`animate-fade-up rounded-2xl p-3 text-sm ${message.role === "user" ? "ml-auto max-w-[80%] bg-accent text-white" : "mr-auto max-w-[90%] bg-white"}`}>
              <p>{message.text}</p>
              {message.structured ? (
                <div className="mt-3 space-y-2 rounded-xl border border-border bg-slate-50 p-3 text-text">
                  <p className="text-xs font-bold">Резюме</p>
                  <p>{message.structured.summary}</p>
                  <p className="text-xs font-bold">Инсайты</p>
                  <ul className="list-disc pl-5">
                    {message.structured.insights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-xs font-bold">Что сделать</p>
                  <ul className="list-disc pl-5">
                    {message.structured.recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-xs font-bold text-amber-700">Флаги риска</p>
                  <ul className="list-disc pl-5 text-amber-700">
                    {message.structured.risk_flags.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg border border-border px-2 py-1 text-xs">Создать дашборд по теме</button>
                    <button className="rounded-lg border border-border px-2 py-1 text-xs">Поставить задачу агенту</button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={roleMeta[role].placeholder}
            className="min-h-24 w-full rounded-xl border border-border p-3 text-sm"
          />
          <button onClick={askAdvisor} disabled={loading} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Анализируем..." : "Отправить консультанту"}
          </button>
        </div>
      </Card>

      <Card className="animate-fade-up">
        <h3 className="mb-3 text-sm font-bold">Контекст бизнеса</h3>
        {activeSession ? <p className="mb-3 text-xs text-muted">Активная тема: {activeSession.title}</p> : null}
        <div className="space-y-2 text-sm">
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">KPI (кэш)</p>
            <p>Выручка: {(context.kpi?.revenue_30d ?? 3950000).toLocaleString("ru-RU")} ₽</p>
            <p>Расходы: {(context.kpi?.expenses_30d ?? 2510000).toLocaleString("ru-RU")} ₽</p>
            <p>Маржа: {context.kpi?.margin_pct ?? 36.5}%</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Источники данных</p>
            <p>{(context.dataSources ?? ["google_sheets", "bitrix24", "excel_upload"]).join(", ")}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 animate-soft-pulse">
            <p className="text-xs font-bold">Предупреждения</p>
            {(context.warnings ?? ["2 источника данных требуют синхронизацию"]).map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
