"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type OwnerPayload = {
  health: { score: number; components: { financial: number; cash: number; operations: number; riskPenalty: number } };
  focusOfDay: string;
  problemOfWeek: string;
};

export default function OwnerPage() {
  const [data, setData] = useState<OwnerPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/owner/health");
      const json = (await res.json()) as OwnerPayload;
      setData(json);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-emerald-50 to-cyan-50">
        <h2 className="text-xl font-bold">Owner Mode</h2>
        <p className="text-sm text-muted">Экран собственника: Health Score, риски и главный фокус дня.</p>
      </Card>

      <div className="dashboard-grid">
        <Card className="col-span-12 md:col-span-4">
          <p className="text-sm text-muted">Health Score</p>
          <p className="text-5xl font-extrabold text-accent">{data?.health.score ?? "--"}</p>
          <p className="text-xs text-muted">0-100, чем выше, тем устойчивее бизнес</p>
        </Card>
        <Card className="col-span-12 md:col-span-8">
          <p className="mb-2 text-sm font-semibold">Компоненты</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl border border-border p-3">Финансы: {data?.health.components.financial ?? "--"}</div>
            <div className="rounded-xl border border-border p-3">Cash: {data?.health.components.cash ?? "--"}</div>
            <div className="rounded-xl border border-border p-3">Операции: {data?.health.components.operations ?? "--"}</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-2 text-sm font-semibold">Главная проблема недели</p>
          <p className="text-sm">{data?.problemOfWeek ?? "Загрузка..."}</p>
        </Card>
        <Card>
          <p className="mb-2 text-sm font-semibold">Главный фокус дня</p>
          <p className="text-sm">{data?.focusOfDay ?? "Загрузка..."}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/finance" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            Перейти в Smart Finance
          </Link>
          <Link href="/advisor" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Открыть Smart Advisor
          </Link>
          <Link href="/watch" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Смотреть алерты
          </Link>
        </div>
      </Card>
    </div>
  );
}
