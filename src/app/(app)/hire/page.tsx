"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type HireResponse = {
  request: {
    id: string;
    role_type: string;
    raw_description: string;
    ai_generated_brief: string;
    status: string;
    createdAt: string;
  };
};

type HireList = {
  requests: Array<{
    id: string;
    role_type: string;
    ai_generated_brief: string;
    createdAt: string;
  }>;
};

const roles = ["Бухгалтер", "Финансист", "Маркетолог", "Настройщик рекламы", "Интегратор CRM", "Разработчик", "Дизайнер"];

export default function HirePage() {
  const [roleType, setRoleType] = useState("Бухгалтер");
  const [description, setDescription] = useState("");
  const [brief, setBrief] = useState("");
  const [history, setHistory] = useState<HireList["requests"]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/hire/requests");
      const json = (await res.json()) as HireList;
      setHistory(json.requests);
    };

    void load();
  }, []);

  const generate = async () => {
    const res = await fetch("/api/hire/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleType, rawDescription: description })
    });

    if (!res.ok) {
      return;
    }

    const json = (await res.json()) as HireResponse;
    setBrief(json.request.ai_generated_brief);
    setHistory((prev) => [
      {
        id: json.request.id,
        role_type: json.request.role_type,
        ai_generated_brief: json.request.ai_generated_brief,
        createdAt: json.request.createdAt
      },
      ...prev
    ]);
  };

  const copyBrief = async () => {
    if (!brief) {
      return;
    }
    await navigator.clipboard.writeText(brief);
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up">
        <h2 className="mb-2 text-xl font-bold">Smart Hire</h2>
        <p className="text-sm text-muted">Поиск специалистов и генерация готовой заявки для маркетплейсов услуг.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Кого вы ищете?</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setRoleType(role)}
                className={`rounded-xl border px-3 py-1.5 text-sm ${roleType === role ? "border-accent bg-accentSoft text-accent" : "border-border text-muted"}`}
              >
                {role}
              </button>
            ))}
          </div>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 w-full rounded-xl border border-border p-3 text-sm"
            placeholder="Что нужно сделать? Можно оставить пустым — AI сам сформирует ТЗ из контекста бизнеса."
          />
          <button onClick={generate} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            Сгенерировать заявку
          </button>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Черновик заявки</h3>
          <textarea value={brief} onChange={(event) => setBrief(event.target.value)} className="min-h-60 w-full rounded-xl border border-border p-3 text-sm" />
          <div className="mt-3 flex gap-2">
            <button onClick={copyBrief} className="rounded-xl border border-border px-4 py-2 text-sm">
              Скопировать текст заявки
            </button>
            <button className="rounded-xl border border-border px-4 py-2 text-sm" disabled>
              Отправка в маркетплейсы (скоро)
            </button>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">История заявок</h3>
        <div className="space-y-2">
          {history.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-3">
              <p className="text-sm font-semibold">{item.role_type}</p>
              <p className="line-clamp-2 text-sm text-muted">{item.ai_generated_brief}</p>
              <p className="text-xs text-muted">{new Date(item.createdAt).toLocaleString("ru-RU")}</p>
            </div>
          ))}
          {history.length === 0 ? <p className="text-sm text-muted">Пока нет заявок.</p> : null}
        </div>
      </Card>
    </div>
  );
}
