"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Source = { id: string; name: string; status: "connected" | "needs_refresh" | "error"; lastSync: string };

export default function MarketingSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/sources");
      const json = await res.json();
      setSources(json.sources ?? []);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Источники маркетинга</h2>
            <p className="text-sm text-muted">Подключите рекламные аккаунты, чтобы видеть реальные расходы, лиды и сделки по каналам.</p>
          </div>
          <HelpPopover
            title="Зачем подключать источники"
            items={[
              "Без интеграций отчеты будут неполными.",
              "Проверяйте статус синхронизации и обновляйте доступы.",
              "При ошибках используйте переподключение."
            ]}
          />
        </div>
      </Card>

      <div className="space-y-2">
        {sources.map((source) => (
          <Card key={source.id} className="bg-white/90">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{source.name}</p>
                <p className="text-xs text-muted">Последняя синхронизация: {source.lastSync}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <span className={`rounded-lg px-2 py-1 ${source.status === "connected" ? "bg-emerald-100 text-emerald-700" : source.status === "needs_refresh" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                  {source.status === "connected" ? "Подключен" : source.status === "needs_refresh" ? "Требуется обновление" : "Ошибка"}
                </span>
                <button className="rounded-lg border border-border px-2 py-1">Переподключить</button>
                <button className="rounded-lg border border-border px-2 py-1">Настройки</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
