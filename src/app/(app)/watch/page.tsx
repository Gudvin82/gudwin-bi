"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Alert = { id: string; type: string; level: string; message: string; channel: string; createdAt: string };

export default function WatchPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mode, setMode] = useState("critical_only");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/watch/alerts");
      const json = await res.json();
      setAlerts(json.alerts ?? []);
      setMode(json.mode ?? "critical_only");
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-rose-50 to-orange-50">
        <h2 className="text-xl font-bold">Мониторинг (Smart Watch)</h2>
        <p className="text-sm text-muted">Мониторинг аномалий, кассовых рисков и KPI-отклонений. Каналы: Telegram/SMS/дашборд.</p>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Режим алертов</h3>
        <div className="flex gap-2 text-sm">
          <button onClick={() => setMode("morning_briefing")} className={`rounded-xl border px-3 py-2 ${mode === "morning_briefing" ? "border-accent bg-accentSoft" : "border-border"}`}>
            Утренний брифинг
          </button>
          <button onClick={() => setMode("critical_only")} className={`rounded-xl border px-3 py-2 ${mode === "critical_only" ? "border-accent bg-accentSoft" : "border-border"}`}>
            Только критические
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Алерты</h3>
        <div className="space-y-2 text-sm">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl border p-3 ${alert.level === "critical" ? "border-red-300 bg-red-50" : "border-border"}`}>
              <p className="font-semibold">{alert.type} • {alert.level}</p>
              <p>{alert.message}</p>
              <p className="text-xs text-muted">Канал: {alert.channel} • {new Date(alert.createdAt).toLocaleString("ru-RU")}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
