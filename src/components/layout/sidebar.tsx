"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, BookOpen, Boxes, Building2, CalendarDays, ChevronDown, ChevronRight, FileText, LayoutDashboard, LineChart, Link2, Settings, Sparkles, Target, UserRoundCog, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  matches: string[];
  children: NavItem[];
};

const sections: NavSection[] = [
  {
    key: "home",
    href: "/owner",
    label: "Главная",
    icon: UserRoundCog,
    matches: ["/owner", "/overview"],
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
    matches: ["/finance"],
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
    matches: ["/marketing"],
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
    matches: ["/analytics", "/dashboards", "/sources"],
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
    label: "ИИ-советник",
    icon: Sparkles,
    matches: ["/advisor"],
    children: [
      { href: "/advisor", label: "Чат-консультант" },
      { href: "/advisor/board", label: "AI-совет директоров" },
      { href: "/advisor/growth", label: "Идеи роста" },
      { href: "/advisor/journal", label: "Дневник бизнеса" }
    ]
  },
  {
    key: "goals",
    href: "/goals",
    label: "Цели",
    icon: Target,
    matches: ["/goals"],
    children: [
      { href: "/goals", label: "Цели и план" },
      { href: "/goals/focus", label: "Фокус владельца" }
    ]
  },
  {
    key: "automation",
    href: "/automation",
    label: "Сценарии и агенты",
    icon: Boxes,
    matches: ["/automation"],
    children: [
      { href: "/automation", label: "Конструктор сценариев" },
      { href: "/calendar", label: "Календарь и встречи" },
      { href: "/automation/templates", label: "Готовые шаблоны" }
    ]
  },
  {
    key: "calendar",
    href: "/calendar",
    label: "Календарь",
    icon: CalendarDays,
    matches: ["/calendar"],
    children: [
      { href: "/calendar", label: "Встречи и расписания" }
    ]
  },
  {
    key: "team",
    href: "/team",
    label: "Команда",
    icon: Users,
    matches: ["/team", "/hire", "/desktop-agent"],
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
    label: "Юр отдел",
    icon: FileText,
    matches: ["/docs", "/legal"],
    children: [
      { href: "/docs", label: "Контрагенты и проверки" },
      { href: "/docs/fines-monitoring", label: "Мониторинг штрафов" },
      { href: "/docs/contracts-audit", label: "Глубокий аудит договоров" }
    ]
  },
  {
    key: "watch",
    href: "/watch",
    label: "Мониторинг",
    icon: AlertTriangle,
    matches: ["/watch", "/monitoring"],
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
    matches: ["/integrations", "/competitor", "/agents", "/connect"],
    children: [
      { href: "/integrations", label: "Подключенные системы" },
      { href: "/connect", label: "Автоправила (если → то)" },
      { href: "/contacts", label: "Заказать доп. интеграцию" }
    ]
  },
  {
    key: "learn",
    href: "/learn",
    label: "Помощь и обучение",
    icon: BookOpen,
    matches: ["/learn", "/onboarding"],
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
    matches: ["/settings"],
    children: [
      { href: "/settings", label: "Рабочее пространство" },
      { href: "/settings/requisites", label: "Мои реквизиты" },
      { href: "/settings/ai-keys", label: "ИИ-провайдеры и ключи" },
      { href: "/settings/simple", label: "Режим «Объяснить просто»" }
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
    const active = sections.find((section) =>
      section.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    );
    return active?.key ?? "home";
  }, [pathname]);

  const [opened, setOpened] = useState<string>(defaultOpen);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpened(defaultOpen);
    navRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [defaultOpen]);

  return (
    <aside className={cn("sticky top-0 h-dvh w-72 shrink-0 border-r border-slate-200/70 bg-gradient-to-b from-white/85 to-slate-50/80 p-4 backdrop-blur-xl", className)}>
      <Link href="/owner" onClick={onNavigate} className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm hover:bg-slate-50">
        <div className="grid h-10 w-10 place-content-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 text-sm font-bold text-white">GW</div>
        <div>
          <p className="premium-title text-base font-extrabold tracking-tight">GudWin BI</p>
          <p className="text-xs text-muted">AI-операционная система</p>
        </div>
      </Link>

      <nav ref={navRef} className="max-h-[calc(100dvh-170px)] space-y-2 overflow-y-auto pr-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = section.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
          const isOpen = opened === section.key;

          return (
            <div key={section.key} className="rounded-xl border border-slate-200/80 bg-white/90 shadow-sm">
              <div
                className={cn(
                  "flex w-full items-center justify-between rounded-xl",
                  active ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm" : "text-text"
                )}
              >
                <Link
                  href={section.href}
                  onClick={() => {
                    setOpened(section.key);
                    onNavigate?.();
                  }}
                  className={cn(
                    "inline-flex min-w-0 flex-1 items-center gap-2 rounded-l-xl px-3 py-2.5 text-sm font-semibold",
                    active ? "text-white" : "text-text hover:bg-slate-100"
                  )}
                >
                  <Icon size={16} />
                  <span className="truncate">{section.label}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpened(isOpen ? "" : section.key)}
                  aria-label={isOpen ? `Свернуть раздел ${section.label}` : `Развернуть раздел ${section.label}`}
                  className={cn(
                    "grid h-full w-10 place-items-center rounded-r-xl",
                    active ? "text-white/90 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>

              {isOpen ? (
                <div className="space-y-1 p-2">
                  {section.children.map((child) => {
                    const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => onNavigate?.()}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                          childActive ? "border border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50 font-semibold text-cyan-800" : "text-muted hover:bg-slate-100"
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

      <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/95 p-3 text-xs text-muted shadow-sm">
        <div className="mb-1 inline-flex items-center gap-2">
          <Building2 size={14} />
          <span className="font-semibold text-text">GudWin Workspace</span>
        </div>
        <p>Тариф: Премиум</p>
      </div>
    </aside>
  );
}
