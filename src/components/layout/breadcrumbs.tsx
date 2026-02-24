"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  overview: "Обзор",
  dashboards: "Дашборды",
  sources: "Источники данных",
  ai: "AI-аналитика",
  settings: "Настройки",
  onboarding: "Быстрый старт",
  advisor: "Smart Advisor",
  agents: "Smart Agents",
  hire: "Smart Hire"
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
      <Link href="/overview" className="rounded-md px-2 py-1 hover:bg-slate-100">
        GudWin BI
      </Link>
      {segments.map((segment, idx) => {
        const href = `/${segments.slice(0, idx + 1).join("/")}`;
        const isLast = idx === segments.length - 1;
        return (
          <div key={href} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-text">{labels[segment] ?? segment}</span>
            ) : (
              <Link href={href} className="rounded-md px-2 py-1 hover:bg-slate-100">
                {labels[segment] ?? segment}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
