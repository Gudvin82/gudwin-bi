"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, Brain, Boxes, Home, Target, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/owner", label: "Главная", icon: Home },
  { href: "/finance", label: "Финансы", icon: Wallet },
  { href: "/marketing", label: "Маркетинг", icon: BarChart3 },
  { href: "/goals", label: "Цели", icon: Target },
  { href: "/automation", label: "Сценарии", icon: Boxes },
  { href: "/advisor", label: "Советник", icon: Brain },
  { href: "/watch", label: "Алерты", icon: Bell }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-2 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-7 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-xl text-[11px] font-semibold",
                active ? "bg-gradient-to-b from-cyan-50 to-teal-50 text-cyan-700" : "text-slate-600"
              )}
            >
              <Icon size={16} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
