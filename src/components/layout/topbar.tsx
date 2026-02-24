"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, CalendarRange, Sparkles, UserCircle2 } from "lucide-react";

const headerMap: Record<string, { title: string; subtitle: string }> = {
  owner: { title: "Режим владельца", subtitle: "Ключевые метрики, риски и фокус дня для собственника." },
  overview: { title: "Главная панель", subtitle: "Быстрый обзор показателей и стартовых действий." },
  finance: { title: "Финансы", subtitle: "Юнит-экономика, cash flow, сценарии и утечки денег." },
  marketing: { title: "Маркетинг", subtitle: "Эффективность каналов, кампании, эксперименты и креативы." },
  advisor: { title: "AI-советник", subtitle: "Рекомендации по бизнесу, финансам и операционке." },
  docs: { title: "Юридический", subtitle: "Проверка контрагентов, кандидатов и договорные риски." },
  watch: { title: "Мониторинг", subtitle: "Алерты, события и автоматические реакции." },
  analytics: { title: "Аналитика", subtitle: "Дашборды, отчеты и подключение источников данных." },
  sources: { title: "Источники данных", subtitle: "Подключение таблиц, CRM и загрузка файлов." },
  settings: { title: "Настройки", subtitle: "Доступы, интеграции и параметры рабочего пространства." },
  team: { title: "Команда", subtitle: "Сотрудники, кандидаты и эффективность отделов." },
  hire: { title: "Подбор", subtitle: "Заявки на найм и базовый скрининг кандидатов." },
  agents: { title: "AI-агенты", subtitle: "Запуск и управление задачами бизнес-агентов." }
};

export function Topbar() {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "owner";
  const header = headerMap[firstSegment] ?? { title: "Рабочий кабинет", subtitle: "Управляйте финансами, командой и рисками из единого центра." };

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{header.title}</h1>
        <p className="text-sm text-muted">{header.subtitle}</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-muted">
          <span className={`inline-flex h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-rose-500"}`} />
          {online ? "Сеть доступна" : "Нет подключения к сети"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/overview" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold shadow-sm">
          Открыть обзор
        </Link>
        <Link href="/sources" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm">
          <Sparkles size={16} />
          Подключить данные
        </Link>
        <button aria-label="Выбрать период отчета" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-muted shadow-sm">
          <CalendarRange size={16} />
          Последние 30 дней
        </button>
        <button aria-label="Открыть уведомления" className="rounded-xl border border-slate-200 bg-white/90 p-2.5 text-muted shadow-sm">
          <Bell size={16} />
        </button>
        <button aria-label="Открыть профиль владельца" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium shadow-sm">
          <UserCircle2 size={16} />
          Владелец
        </button>
      </div>
    </header>
  );
}
