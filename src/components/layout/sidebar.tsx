"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, BarChart3, Bot, BriefcaseBusiness, Database, FileText, LayoutDashboard, Link2, Rocket, Settings, Sparkles, Target, UserRoundCog, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/onboarding", label: "Быстрый старт", icon: Rocket },
  { href: "/owner", label: "Owner Mode", icon: UserRoundCog },
  { href: "/overview", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboards", label: "Дашборды", icon: BarChart3 },
  { href: "/sources", label: "Источники данных", icon: Database },
  { href: "/ai", label: "AI-аналитика", icon: Bot },
  { href: "/advisor", label: "Smart Advisor", icon: Sparkles },
  { href: "/finance", label: "Smart Finance", icon: Target },
  { href: "/agents", label: "Smart Agents", icon: Bot },
  { href: "/hire", label: "Smart Hire", icon: BriefcaseBusiness },
  { href: "/docs", label: "Docs & Law", icon: FileText },
  { href: "/connect", label: "Smart Connect", icon: Link2 },
  { href: "/watch", label: "Smart Watch", icon: AlertTriangle },
  { href: "/learn", label: "Обучение / FAQ", icon: Users },
  { href: "/competitor", label: "Competitor Watch", icon: Target },
  { href: "/contacts", label: "Контакты", icon: Users },
  { href: "/settings", label: "Настройки", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card/80 p-5 backdrop-blur-sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-content-center rounded-xl bg-accent text-sm font-bold text-white">GW</div>
        <div>
          <p className="text-base font-bold">GudWin BI</p>
          <p className="text-xs text-muted">AI-помощник для бизнеса</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-accent text-white" : "text-muted hover:bg-slate-100 hover:text-text"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
