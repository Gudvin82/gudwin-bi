"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Campaign = {
  id: string;
  channel: string;
  name: string;
  status: "active" | "paused" | "archived";
  spend: number;
  leads: number;
  deals: number;
  revenue: number;
  romi: number;
  cac: number;
  aiDecision: "Отключить" | "Оптимизировать" | "Масштабировать";
};

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "archived">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/marketing/campaigns");
        if (!res.ok) {
          setError("Не удалось загрузить кампании.");
          return;
        }
        const json = await res.json();
        setCampaigns(json.campaigns ?? []);
      } catch {
        setError("Не удалось загрузить кампании.");
      }
    };
    void load();
  }, []);

  const visible = useMemo(() => campaigns.filter((item) => (filter === "all" ? true : item.status === filter)), [campaigns, filter]);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-indigo-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Кампании</h2>
            <p className="text-sm text-muted">Смотрите, какие кампании работают, а какие сжигают бюджет.</p>
            {error ? <p className="mt-2 text-xs font-semibold text-amber-700">{error}</p> : null}
          </div>
          <HelpPopover
            title="Как читать рекомендации"
            items={[
              "Отключить — убыточная кампания, ROMI ниже 0.",
              "Оптимизировать — на грани, есть потенциал.",
              "Масштабировать — стабильная эффективность и запас роста."
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2 text-sm">
          <button onClick={() => setFilter("all")} className={`rounded-xl border px-3 py-2 ${filter === "all" ? "border-accent bg-accentSoft" : "border-border"}`}>Все</button>
          <button onClick={() => setFilter("active")} className={`rounded-xl border px-3 py-2 ${filter === "active" ? "border-accent bg-accentSoft" : "border-border"}`}>Активные</button>
          <button onClick={() => setFilter("paused")} className={`rounded-xl border px-3 py-2 ${filter === "paused" ? "border-accent bg-accentSoft" : "border-border"}`}>На паузе</button>
          <button onClick={() => setFilter("archived")} className={`rounded-xl border px-3 py-2 ${filter === "archived" ? "border-accent bg-accentSoft" : "border-border"}`}>Архив</button>
          <button onClick={() => setFilter("all")} className="rounded-xl border border-border px-3 py-2">Показать точки роста</button>
          <button onClick={() => setFilter("active")} className="rounded-xl border border-border px-3 py-2">Показать проблемные кампании</button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((item) => (
          <Card key={item.id} className="bg-white/90">
            <p className="text-xs text-muted">{item.channel} • {item.status === "active" ? "Активна" : item.status === "paused" ? "На паузе" : "Архив"}</p>
            <h3 className="mt-1 text-base font-semibold">{item.name}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-border p-2">Расход: {item.spend.toLocaleString("ru-RU")} ₽</div>
              <div className="rounded-lg border border-border p-2">Выручка: {item.revenue.toLocaleString("ru-RU")} ₽</div>
              <div className="rounded-lg border border-border p-2">Лиды/сделки: {item.leads}/{item.deals}</div>
              <div className="rounded-lg border border-border p-2">CAC: {item.cac.toLocaleString("ru-RU")} ₽</div>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-slate-50 p-2 text-sm">
              <span className={item.romi < 0 ? "text-red-700" : "text-emerald-700"}>ROMI: {item.romi}%</span>
              <span className={`rounded-md px-2 py-1 text-xs ${item.aiDecision === "Отключить" ? "bg-rose-100 text-rose-700" : item.aiDecision === "Оптимизировать" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{item.aiDecision}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
