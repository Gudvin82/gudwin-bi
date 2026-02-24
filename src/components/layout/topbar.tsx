"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, CalendarRange, LogOut, Menu, Sparkles, UserCircle2 } from "lucide-react";

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

const accentMap: Record<string, { title: string; chip: string; ring: string }> = {
  owner: { title: "text-cyan-900", chip: "from-cyan-50 to-teal-50 text-cyan-700", ring: "ring-cyan-200/70" },
  finance: { title: "text-emerald-900", chip: "from-emerald-50 to-teal-50 text-emerald-700", ring: "ring-emerald-200/70" },
  marketing: { title: "text-indigo-900", chip: "from-indigo-50 to-sky-50 text-indigo-700", ring: "ring-indigo-200/70" },
  advisor: { title: "text-violet-900", chip: "from-violet-50 to-fuchsia-50 text-violet-700", ring: "ring-violet-200/70" },
  watch: { title: "text-rose-900", chip: "from-rose-50 to-orange-50 text-rose-700", ring: "ring-rose-200/70" }
};

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accountName, setAccountName] = useState("Анатолий Гудвин");
  const [accountRole, setAccountRole] = useState("owner");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [periodPreset, setPeriodPreset] = useState("30d");

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

  useEffect(() => {
    const savedName = localStorage.getItem("gw_profile_name");
    const savedRole = localStorage.getItem("gw_profile_role");
    if (savedName) setAccountName(savedName);
    if (savedRole) setAccountRole(savedRole);
  }, []);

  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "owner";
  const header = headerMap[firstSegment] ?? { title: "Рабочий кабинет", subtitle: "Управляйте финансами, командой и рисками из единого центра." };
  const accent = accentMap[firstSegment] ?? accentMap.owner;
  const primarySourceActionLabel = ["owner", "overview", "sources", "onboarding"].includes(firstSegment)
    ? "Подключить данные"
    : "Управлять источниками";

  const refreshData = () => {
    setRefreshing(true);
    window.location.reload();
  };
  const roleLabelMap: Record<string, string> = {
    owner: "Владелец",
    admin: "Администратор",
    member: "Сотрудник",
    viewer: "Наблюдатель"
  };
  const accountRoleLabel = roleLabelMap[accountRole] ?? accountRole;

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/pin";
    }
  };

  return (
    <header className={`mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-2 shadow-sm backdrop-blur-xl ring-1 ${accent.ring} sm:mb-6 sm:gap-3 sm:p-4`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Открыть меню"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm md:hidden"
          >
            <Menu size={18} />
          </button>
          <h1 className={`premium-title truncate text-base font-extrabold sm:text-2xl ${accent.title}`}>{header.title}</h1>
        </div>
        <p className="premium-subtitle mt-1 hidden line-clamp-2 text-sm sm:block">{header.subtitle}</p>
        <div className={`premium-nav-chip mt-2 hidden items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs sm:inline-flex ${accent.chip}`}>
          <span className={`inline-flex h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-rose-500"}`} />
          {online ? "Сеть доступна" : "Нет подключения к сети"}
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
        <Link href="/overview" className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold shadow-sm md:inline-flex">
          Открыть обзор
        </Link>
        <Link href="/sources" className="btn-premium-primary hidden min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm sm:inline-flex">
          <Sparkles size={16} />
          {primarySourceActionLabel}
        </Link>
        <Link href="/sources" className="btn-premium-primary inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm sm:hidden">
          <Sparkles size={14} />
          Источники
        </Link>
        <div className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-muted shadow-sm md:inline-flex">
          <CalendarRange size={16} />
          <select value={periodPreset} onChange={(event) => setPeriodPreset(event.target.value)} className="bg-transparent text-sm outline-none">
            <option value="1d">1 день</option>
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
            <option value="month">Текущий месяц</option>
            <option value="year">Текущий год</option>
            <option value="custom">Период (от и до)</option>
          </select>
        </div>
        <button aria-label="Открыть уведомления" className="rounded-xl border border-slate-200 bg-white/90 p-2.5 text-muted shadow-sm">
          <Bell size={16} />
        </button>
        <button onClick={refreshData} className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
          {refreshing ? "Обновляем..." : "Обновить данные"}
        </button>
        <div className="relative hidden sm:block">
          <button
            aria-label="Открыть меню аккаунта"
            onClick={() => setShowAccountMenu((prev) => !prev)}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium shadow-sm"
          >
            <UserCircle2 size={16} />
            <span className="max-w-[180px] truncate">{accountName}</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{accountRoleLabel}</span>
          </button>
          {showAccountMenu ? (
            <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-sm font-semibold text-slate-800">{accountName}</p>
                <p className="text-xs text-slate-500">Роль доступа: {accountRoleLabel}</p>
              </div>
              <div className="mt-2 space-y-1">
                <Link href="/settings" onClick={() => setShowAccountMenu(false)} className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-100">
                  Настройки аккаунта
                </Link>
                <button onClick={logout} className="inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-rose-700 hover:bg-rose-50">
                  <LogOut size={14} />
                  Выйти
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
