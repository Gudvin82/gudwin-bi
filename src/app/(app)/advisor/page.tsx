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

type ExplainBlock = {
  data_basis: Array<{ source: string; metric: string; value: string | number }>;
  reasoning_steps: string[];
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  structured?: AssistantBlock;
  explain?: ExplainBlock;
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
  const [decisionStatus, setDecisionStatus] = useState<string>("");
  const [decisions, setDecisions] = useState<Array<{ id: string; recommendation: string; status: string }>>([]);
  const appendMessages = (incoming: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...incoming].slice(-30));
  };

  const activeSession = useMemo(() => sessions.find((item) => item.id === activeSessionId) ?? null, [sessions, activeSessionId]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/advisor/sessions");
      const json = (await res.json()) as { sessions: SessionItem[] };
      setSessions(json.sessions);
      if (json.sessions[0]) {
        setActiveSessionId(json.sessions[0].id);
      }

      const dRes = await fetch("/api/advisor/decision-log");
      const dJson = (await dRes.json()) as { items: Array<{ id: string; recommendation: string; status: string }> };
      setDecisions(dJson.items ?? []);
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
    appendMessages([userMessage]);

    const res = await fetch("/api/advisor/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, message: input, sessionId: activeSessionId ?? undefined })
    });

    if (!res.ok) {
      appendMessages([{ id: crypto.randomUUID(), role: "assistant", text: "Ошибка запроса к консультанту. Попробуйте снова." }]);
      setLoading(false);
      return;
    }

    const json = (await res.json()) as AssistantBlock & {
      explain?: ExplainBlock;
      context?: { kpi?: Record<string, number>; dataSources?: string[]; warnings?: string[] };
    };
    appendMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: json.summary,
        structured: {
          summary: json.summary,
          insights: json.insights,
          recommendations: json.recommendations,
          risk_flags: json.risk_flags
        },
        explain: json.explain
      }
    ]);
    setContext(json.context ?? {});
    setInput("");
    setLoading(false);
  };

  const saveDecision = async (sessionId: string, recommendation: string, status: "accepted" | "rejected" | "in_progress") => {
    const res = await fetch("/api/advisor/decision-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, recommendation, status })
    });
    setDecisionStatus(res.ok ? "Решение сохранено в журнал решений." : "Не удалось сохранить решение.");
    if (res.ok) {
      const dRes = await fetch("/api/advisor/decision-log");
      const dJson = (await dRes.json()) as { items: Array<{ id: string; recommendation: string; status: string }> };
      setDecisions(dJson.items ?? []);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-violet-50 via-cyan-50/70 to-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Advisor Center</p>
            <h2 className="text-2xl font-extrabold tracking-tight">AI-советник</h2>
            <p className="text-sm text-muted">Бизнес-консультант, AI-бухгалтер и AI-финансист в одном рабочем пространстве.</p>
          </div>
          <span className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs text-violet-700">Контекст + Explain + Decision Log</span>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
      <Card className="animate-fade-up bg-white/95">
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

      <Card className="animate-fade-up bg-white/95">
        <div className="mb-3 flex flex-wrap gap-2">
          {(Object.keys(roleMeta) as AdvisorRole[]).map((roleId) => (
            <button
              key={roleId}
              onClick={() => {
                setRole(roleId);
                setInput(roleMeta[roleId].placeholder);
              }}
              className={`rounded-xl border px-3 py-2 text-sm ${role === roleId ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-border text-muted"}`}
            >
              {roleMeta[roleId].avatar} {roleMeta[roleId].label}
            </button>
          ))}
        </div>

        <div className="mb-4 max-h-[520px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          {messages.length === 0 ? <p className="text-sm text-muted">Задайте первый вопрос консультанту по вашему бизнесу.</p> : null}
          {messages.map((message) => (
            <div key={message.id} className={`animate-fade-up rounded-2xl p-3 text-sm ${message.role === "user" ? "ml-auto max-w-[80%] bg-gradient-to-r from-cyan-600 to-teal-600 text-white" : "mr-auto max-w-[90%] border border-slate-200 bg-white"}`}>
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
                      <li key={item} className="space-y-2">
                        <p>{item}</p>
                        <div className="flex flex-wrap gap-1">
                          <button onClick={() => saveDecision(activeSessionId ?? "demo", item, "accepted")} className="rounded border border-border px-2 py-1 text-xs">Принято</button>
                          <button onClick={() => saveDecision(activeSessionId ?? "demo", item, "in_progress")} className="rounded border border-border px-2 py-1 text-xs">В работе</button>
                          <button onClick={() => saveDecision(activeSessionId ?? "demo", item, "rejected")} className="rounded border border-border px-2 py-1 text-xs">Отклонено</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {message.explain ? (
                    <div className="rounded-xl border border-border bg-white p-2 text-xs">
                      <p className="font-bold">Explain: на чем основаны выводы</p>
                      <ul className="list-disc pl-4">
                        {message.explain.data_basis.map((item, idx) => (
                          <li key={`${item.metric}-${idx}`}>{item.source}: {item.metric} = {String(item.value)}</li>
                        ))}
                      </ul>
                      <p className="mt-1 font-bold">Логика</p>
                      <ul className="list-disc pl-4">
                        {message.explain.reasoning_steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
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
          <div className="flex flex-wrap gap-2">
            {[
              "Какие каналы сейчас сжигают бюджет?",
              "Где стоит увеличить бюджет в первую очередь?",
              "Что протестировать в маркетинге на этой неделе?"
            ].map((question) => (
              <button key={question} onClick={() => setInput(question)} className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted hover:bg-slate-50">
                {question}
              </button>
            ))}
          </div>
          <button onClick={askAdvisor} disabled={loading} className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Анализируем..." : "Отправить консультанту"}
          </button>
        </div>
        {decisionStatus ? <p className="mt-2 text-xs text-muted">{decisionStatus}</p> : null}
      </Card>

      <Card className="animate-fade-up bg-white/95">
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
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Юнит-экономика</p>
            <p>LTV/CAC: 2.84 (цель {'>'} 3)</p>
            <p>ROMI: 132%</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Прогноз денег</p>
            <p>Прогноз мин. остатка на 30 дней: -120 000 ₽</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Утечки денег</p>
            <p>3 критичных зоны утечки</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Маркетинг</p>
            <p>ROMI: 50.8% • CAC: 4 373 ₽</p>
            <p>Проблема: VK Реклама и myTarget убыточны</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Прогноз</p>
            <p>Прогноз выручки на 3 мес: +8.5%</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 animate-soft-pulse">
            <p className="text-xs font-bold">Предупреждения</p>
            {(context.warnings ?? ["2 источника данных требуют синхронизацию"]).map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs font-bold">Журнал решений</p>
            <div className="mt-2 space-y-1 text-xs">
              {decisions.slice(0, 5).map((item) => (
                <p key={item.id}>
                  [{item.status}] {item.recommendation}
                </p>
              ))}
              {!decisions.length ? <p className="text-muted">Пока пусто</p> : null}
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
