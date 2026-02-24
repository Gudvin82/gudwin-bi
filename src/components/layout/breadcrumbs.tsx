"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  overview: "Рабочий кабинет",
  main: "Главная",
  dashboards: "Дашборды",
  builder: "Конструктор",
  "report-builder": "Конструктор отчетов",
  sources: "Источники данных",
  ai: "AI-аналитика",
  services: "Сервисы и модули",
  settings: "Настройки",
  monitoring: "Мониторинг",
  legal: "Юридический",
  onboarding: "Быстрый старт",
  owner: "Режим владельца",
  advisor: "Консультант",
  board: "Совет директоров",
  growth: "Идеи роста",
  journal: "Дневник бизнеса",
  finance: "Финансы",
  marketing: "Маркетинг",
  campaigns: "Кампании",
  experiments: "Эксперименты",
  creatives: "Креативы",
  bank: "Смарт Банк",
  accounting: "Смарт Бухгалтерия",
  agents: "Агенты",
  hire: "Найм",
  team: "Команда",
  insights: "Эффективность команды",
  docs: "Документы и право",
  "contracts-audit": "Аудит договоров",
  connect: "Интеграции",
  integrations: "Интеграции",
  watch: "Мониторинг",
  "auto-actions": "Авто-реакции",
  analytics: "Аналитика",
  templates: "Шаблоны отраслей",
  learn: "Обучение / FAQ",
  faq: "FAQ",
  "quick-start": "Быстрый старт",
  guides: "Гайды и статьи",
  videos: "Видео-обучение",
  contacts: "Контакты",
  competitor: "Конкурентный мониторинг",
  "desktop-agent": "Десктоп AI-агент",
  "ai-keys": "AI-провайдеры и ключи",
  simple: "Объяснить просто"
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
      <Link href="/owner" className="rounded-md px-2 py-1 hover:bg-slate-100">
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
