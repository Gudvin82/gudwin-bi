"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardShowcase } from "@/components/dashboard/dashboard-showcase";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const dashboards = [
  { id: "owner", href: "/owner", name: "Рабочий кабинет владельца", updatedAt: "только что", tone: "from-cyan-50 to-blue-50" },
  { id: "finance", href: "/finance", name: "Финансовый контроль", updatedAt: "5 минут назад", tone: "from-emerald-50 to-teal-50" },
  { id: "marketing", href: "/marketing", name: "Маркетинг и ROMI", updatedAt: "11 минут назад", tone: "from-indigo-50 to-sky-50" },
  { id: "sales", href: "/analytics", name: "Продажи и воронка", updatedAt: "18 минут назад", tone: "from-amber-50 to-orange-50" },
  { id: "team", href: "/team", name: "Команда и KPI отделов", updatedAt: "32 минуты назад", tone: "from-lime-50 to-emerald-50" },
  { id: "law", href: "/docs", name: "Юридические риски", updatedAt: "1 час назад", tone: "from-rose-50 to-pink-50" },
  { id: "watch", href: "/watch", name: "Мониторинг и алерты", updatedAt: "1 час назад", tone: "from-red-50 to-orange-50" },
  { id: "board", href: "/advisor/board", name: "Совет директоров", updatedAt: "2 часа назад", tone: "from-violet-50 to-fuchsia-50" }
];

const miniTrend = [45, 52, 60, 58, 66, 71, 74];

export default function DashboardsPage() {
  const [healthScore, setHealthScore] = useState(42);
  const [notes, setNotes] = useState<{ id: string; scope: string; title: string; note: string; createdAt: string }[]>([]);
  const [noteTitle, setNoteTitle] = useState("Запустили акцию");
  const [noteText, setNoteText] = useState("Планируем рост выручки на 8% в течение 2 недель.");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/owner/health");
        if (!res.ok) {
          setError("Не удалось загрузить Health Score.");
          return;
        }
        const json = await res.json();
        setHealthScore(json?.health?.score ?? 42);
      } catch {
        setError("Не удалось загрузить Health Score.");
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await fetch("/api/annotations");
        if (!res.ok) {
          setError("Не удалось загрузить комментарии.");
          return;
        }
        const json = await res.json();
        setNotes(json.items ?? []);
      } catch {
        setError("Не удалось загрузить комментарии.");
      }
    };
    void loadNotes();
  }, []);

  const addNote = async () => {
    try {
      await fetch("/api/annotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "dashboard", title: noteTitle, note: noteText })
      });
      const res = await fetch("/api/annotations");
      const json = await res.json();
      setNotes(json.items ?? []);
    } catch {
      setError("Не удалось добавить комментарий.");
    }
  };

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-r from-white via-slate-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Галерея дашбордов</p>
            <h3 className="text-2xl font-extrabold tracking-tight">Галерея дашбордов</h3>
            <p className="text-sm text-muted">Премиальная витрина для ежедневной работы и инвесторского показа.</p>
            {error ? <p className="mt-2 text-xs font-semibold text-amber-700">{error}</p> : null}
          </div>
          <HelpPopover
            title="Как работать с разделом"
            items={[
              "Откройте готовый дашборд, чтобы быстро оценить направление.",
              "Соберите свой экран в конструкторе дашбордов.",
              "Сформируйте отчет и отправьте его в Telegram/SMS."
            ]}
          />
        </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/dashboards/builder" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Конструктор дашбордов
        </Link>
        <Link href="/analytics/report-builder" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
          Конструктор отчетов
        </Link>
        <Link href="/dashboards/roles" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
          Ролевые дашборды
        </Link>
      </div>
    </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-950 text-white">
          <p className="text-xs text-cyan-200">Health Score</p>
          <p className="mt-1 text-4xl font-extrabold">{healthScore}</p>
          <p className="text-xs text-slate-300">Главный риск: кассовый разрыв через 12 дней.</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Прогноз выручки (30 дней)</p>
          <p className="mt-1 text-2xl font-extrabold">+8.5%</p>
          <div className="mt-3 flex items-end gap-1">
            {miniTrend.map((point, idx) => (
              <div key={`${point}-${idx}`} className="w-4 rounded-t-md bg-gradient-to-t from-cyan-500 to-teal-400" style={{ height: `${point}px` }} />
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs text-muted">Утечки денег</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">3 зоны</p>
          <p className="text-xs text-muted">Маркетплейс и 1 SKU требуют немедленных действий.</p>
        </Card>
      </div>

      <DashboardShowcase />

      <Card className="bg-gradient-to-r from-white via-slate-50 to-emerald-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold">Ролевые дашборды</h3>
            <p className="text-sm text-muted">Экран под владельца, финансы, маркетинг и продажи.</p>
          </div>
          <Link href="/dashboards/roles" className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
            Открыть
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {["Владелец", "Финансы", "Маркетинг"].map((role) => (
            <div key={role} className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
              {role}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Комментарии и аннотации</h3>
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2 text-sm">
            {notes.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-muted">{item.note}</p>
                <p className="mt-1 text-xs text-muted">{new Date(item.createdAt).toLocaleString("ru-RU")}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border p-3 text-sm">
            <p className="mb-2 text-xs text-muted">Добавить комментарий к дашборду</p>
            <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} className="mb-2 w-full rounded-xl border border-border p-2 text-sm" placeholder="Заголовок" />
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Комментарий" />
            <button onClick={addNote} className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Добавить</button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboards.map((dashboard, idx) => (
          <Card key={dashboard.id} className={`animate-fade-up bg-gradient-to-br ${dashboard.tone}`}>
            <p className="mb-1 text-xs text-muted">Панель #{idx + 1}</p>
            <h3 className="mb-1 text-base font-semibold">{dashboard.name}</h3>
            <p className="mb-3 text-xs text-muted">Обновлено: {dashboard.updatedAt}</p>
            <div className="mb-4 flex items-end gap-1">
              {[20, 26, 24, 30, 33, 36, 38].map((bar, barIdx) => (
                <div key={barIdx} className="w-2.5 rounded-sm bg-slate-700/75" style={{ height: `${bar + ((idx % 3) * 6)}px` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={dashboard.href} className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-medium text-white">
                Открыть
              </Link>
              <Link href="/dashboards/builder" className="rounded-xl border border-border bg-white px-3 py-2 text-sm">
                Редактировать
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
