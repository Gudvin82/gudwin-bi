"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, BookOpen, Building2, ChevronDown, ChevronRight, FileText, LayoutDashboard, LineChart, Link2, Settings, Sparkles, Target, UserRoundCog, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

type NavSection = {
  key: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  children: NavItem[];
};

const sections: NavSection[] = [
  {
    key: "home",
    href: "/owner",
    label: "Главная",
    icon: UserRoundCog,
    children: [
      { href: "/owner", label: "Рабочий кабинет" },
      { href: "/overview", label: "Главная панель" }
    ]
  },
  {
    key: "finance",
    href: "/finance",
    label: "Финансы",
    icon: Target,
    children: [
      { href: "/finance", label: "Юнит-экономика и касса" },
      { href: "/finance/bank", label: "Смарт Банк" },
      { href: "/finance/accounting", label: "Смарт Бухгалтерия" }
    ]
  },
  {
    key: "marketing",
    href: "/marketing",
    label: "Маркетинг",
    icon: LineChart,
    children: [
      { href: "/marketing", label: "Обзор" },
      { href: "/marketing/analytics", label: "Аналитика" },
      { href: "/marketing/campaigns", label: "Кампании" },
      { href: "/marketing/experiments", label: "Эксперименты" },
      { href: "/marketing/creatives", label: "Креативы" },
      { href: "/marketing/sources", label: "Источники" }
    ]
  },
  {
    key: "analytics",
    href: "/analytics",
    label: "Аналитика",
    icon: LayoutDashboard,
    children: [
      { href: "/dashboards", label: "Мои дашборды" },
      { href: "/dashboards/builder", label: "Конструктор дашбордов" },
      { href: "/analytics/report-builder", label: "Конструктор отчетов" },
      { href: "/sources", label: "Подключить данные" },
      { href: "/analytics/templates", label: "Шаблоны по отраслям" }
    ]
  },
  {
    key: "advisor",
    href: "/advisor",
    label: "AI-Советник",
    icon: Sparkles,
    children: [
      { href: "/advisor", label: "Чат-консультант" },
      { href: "/advisor/board", label: "AI-совет директоров" },
      { href: "/advisor/growth", label: "Идеи роста" },
      { href: "/advisor/journal", label: "Дневник бизнеса" }
    ]
  },
  {
    key: "team",
    href: "/team",
    label: "Команда",
    icon: Users,
    children: [
      { href: "/team", label: "Сотрудники и кандидаты" },
      { href: "/hire", label: "Подбор и заявки" },
      { href: "/team/insights", label: "Эффективность команды" },
      { href: "/desktop-agent", label: "Десктоп AI-агент (v2+)" }
    ]
  },
  {
    key: "legal",
    href: "/docs",
    label: "Юридический",
    icon: FileText,
    children: [
      { href: "/docs", label: "Контрагенты и проверки" },
      { href: "/docs/contracts-audit", label: "Глубокий аудит договоров" }
    ]
  },
  {
    key: "watch",
    href: "/watch",
    label: "Мониторинг",
    icon: AlertTriangle,
    children: [
      { href: "/watch", label: "События и алерты" },
      { href: "/watch/auto-actions", label: "Авто-реакции" }
    ]
  },
  {
    key: "integrations",
    href: "/integrations",
    label: "Интеграции",
    icon: Link2,
    children: [
      { href: "/connect", label: "Подключенные системы" },
      { href: "/agents", label: "AI-агенты" },
      { href: "/competitor", label: "Конкурентный мониторинг" }
    ]
  },
  {
    key: "learn",
    href: "/learn",
    label: "Помощь и обучение",
    icon: BookOpen,
    children: [
      { href: "/learn", label: "Обзор обучения" },
      { href: "/learn/faq", label: "FAQ" },
      { href: "/learn/quick-start", label: "Быстрый старт" },
      { href: "/learn/guides", label: "Гайды и статьи" },
      { href: "/learn/videos", label: "Видео-обучение" }
    ]
  },
  {
    key: "settings",
    href: "/settings",
    label: "Настройки",
    icon: Settings,
    children: [
      { href: "/settings", label: "Рабочее пространство" },
      { href: "/settings/ai-keys", label: "AI-провайдеры и ключи" },
      { href: "/settings/simple", label: "Режим «Объяснить просто»" },
      { href: "/contacts", label: "Контакты разработки" }
    ]
  }
];

export function Sidebar({
  className,
  onNavigate
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const defaultOpen = useMemo(() => {
    const active = sections.find((section) => section.children.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)));
    return active?.key ?? "home";
  }, [pathname]);

  const [opened, setOpened] = useState<string>(defaultOpen);

  return (
    <aside className={cn("sticky top-0 h-dvh w-72 shrink-0 border-r border-slate-200/70 bg-white/70 p-4 backdrop-blur-xl", className)}>
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
        <div className="grid h-10 w-10 place-content-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 text-sm font-bold text-white">GW</div>
        <div>
          <p className="text-base font-bold tracking-tight">GudWin BI</p>
          <p className="text-xs text-muted">AI-операционная система</p>
        </div>
      </div>

      <nav className="max-h-[calc(100dvh-170px)] space-y-2 overflow-y-auto pr-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = section.children.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));
          const isOpen = opened === section.key;

          return (
            <div key={section.key} className="rounded-xl border border-slate-200/80 bg-white/80 shadow-sm">
              <button
                onClick={() => setOpened(isOpen ? "" : section.key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold",
                  active ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white" : "text-text hover:bg-slate-100"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon size={16} />
                  {section.label}
                </span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isOpen ? (
                <div className="space-y-1 p-2">
                  {section.children.map((child) => {
                    const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                          childActive ? "bg-slate-100 font-semibold text-text" : "text-muted hover:bg-slate-100"
                        )}
                      >
                        <span>→</span>
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/90 p-3 text-xs text-muted shadow-sm">
        <div className="mb-1 inline-flex items-center gap-2">
          <Building2 size={14} />
          <span className="font-semibold text-text">Собственник</span>
        </div>
        <p>Тариф: Премиум</p>
      </div>
    </aside>
  );
}
