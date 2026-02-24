import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const dashboards = [
  { id: "owner", name: "Рабочий кабинет владельца", updatedAt: "только что", tone: "from-cyan-50 to-blue-50" },
  { id: "finance", name: "Финансовый контроль", updatedAt: "5 минут назад", tone: "from-emerald-50 to-teal-50" },
  { id: "marketing", name: "Маркетинг и ROMI", updatedAt: "11 минут назад", tone: "from-indigo-50 to-sky-50" },
  { id: "sales", name: "Продажи и воронка", updatedAt: "18 минут назад", tone: "from-amber-50 to-orange-50" },
  { id: "team", name: "Команда и KPI отделов", updatedAt: "32 минуты назад", tone: "from-lime-50 to-emerald-50" },
  { id: "law", name: "Юридические риски", updatedAt: "1 час назад", tone: "from-rose-50 to-pink-50" },
  { id: "watch", name: "Мониторинг и алерты", updatedAt: "1 час назад", tone: "from-red-50 to-orange-50" },
  { id: "board", name: "Совет директоров", updatedAt: "2 часа назад", tone: "from-violet-50 to-fuchsia-50" }
];

const miniTrend = [45, 52, 60, 58, 66, 71, 74];

export default function DashboardsPage() {
  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-r from-white via-slate-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Dashboard Gallery</p>
            <h3 className="text-2xl font-extrabold tracking-tight">Галерея дашбордов</h3>
            <p className="text-sm text-muted">Премиальная витрина для ежедневной работы и инвесторского показа.</p>
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
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-950 text-white">
          <p className="text-xs text-cyan-200">Health Score</p>
          <p className="mt-1 text-4xl font-extrabold">78</p>
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
              <button className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-medium text-white">Открыть</button>
              <button className="rounded-xl border border-border bg-white px-3 py-2 text-sm">Редактировать</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
