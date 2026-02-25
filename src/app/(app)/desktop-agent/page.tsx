"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Architecture = {
  status: string;
  legal: string[];
  telemetry: string[];
  excluded_by_default: string[];
  integration: { sinks: string[]; alerts: string[] };
};

export default function DesktopAgentPage() {
  const [data, setData] = useState<Architecture | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/desktop-agent/architecture");
      const json = (await res.json()) as Architecture;
      setData(json);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-zinc-50 to-slate-100">
        <h2 className="text-xl font-bold">Десктоп ИИ-агент (v2+)</h2>
        <p className="text-sm text-muted">Архитектура и дорожная карта локального агента мониторинга на рабочем ПК сотрудника.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Юридические рамки</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {(data?.legal ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Какие данные собираются</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {(data?.telemetry ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold">По умолчанию не собираем</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            {(data?.excluded_by_default ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Интеграция в продукт</h3>
        <p className="text-sm">Модули-получатели: {(data?.integration.sinks ?? []).join(", ")}.</p>
        <p className="text-sm">Типы алертов: {(data?.integration.alerts ?? []).join(", ")}.</p>
      </Card>
    </div>
  );
}
