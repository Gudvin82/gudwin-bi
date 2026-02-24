import { Bell, CalendarRange, UserCircle2 } from "lucide-react";

export function Topbar() {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Рабочий кабинет</h1>
        <p className="text-sm text-muted">Загрузите данные и формулируйте отчёты обычным текстом.</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted">
          <CalendarRange size={16} />
          Последние 30 дней
        </button>
        <button className="rounded-xl border border-border bg-card p-2 text-muted">
          <Bell size={16} />
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium">
          <UserCircle2 size={16} />
          Owner
        </button>
      </div>
    </header>
  );
}
