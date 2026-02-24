import Link from "next/link";
import { Bell, CalendarRange, Sparkles, UserCircle2 } from "lucide-react";

export function Topbar() {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Рабочий кабинет</h1>
        <p className="text-sm text-muted">Управляйте финансами, командой и рисками из единого центра.</p>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/overview" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold">
          Показать демо
        </Link>
        <Link href="/sources" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">
          <Sparkles size={16} />
          Подключить данные
        </Link>
        <button aria-label="Выбрать период отчета" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted">
          <CalendarRange size={16} />
          Последние 30 дней
        </button>
        <button aria-label="Открыть уведомления" className="rounded-xl border border-border bg-card p-2.5 text-muted">
          <Bell size={16} />
        </button>
        <button aria-label="Открыть профиль владельца" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium">
          <UserCircle2 size={16} />
          Владелец
        </button>
      </div>
    </header>
  );
}
