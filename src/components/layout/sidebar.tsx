"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Database, LayoutDashboard, Sparkles, Target, UserRoundCog, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/owner", label: "Режим владельца (Owner Mode)", icon: UserRoundCog },
  { href: "/overview", label: "Данные и дашборды", icon: LayoutDashboard },
  { href: "/sources", label: "Источники данных", icon: Database },
  { href: "/finance", label: "Финансы (Smart Finance)", icon: Target },
  { href: "/watch", label: "Мониторинг (Smart Watch)", icon: AlertTriangle },
  { href: "/advisor", label: "Консультант (Smart Advisor)", icon: Sparkles },
  { href: "/services", label: "Сервисы и модули", icon: Wrench }
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
