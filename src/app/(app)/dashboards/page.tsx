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
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-slate-50 via-white to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Галерея дашбордов</h3>
            <p className="text-sm text-muted">Витрина для операционной работы и инвесторского показа: разные бизнес-ракурсы на одном языке.</p>
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
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/dashboards/builder" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            Открыть конструктор дашбордов
          </Link>
          <Link href="/analytics/report-builder" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Открыть конструктор отчетов
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Health Score</p>
          <p className="mt-1 text-4xl font-extrabold text-accent">78</p>
          <p className="text-xs text-muted">Главный риск: кассовый разрыв через 12 дней.</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Прогноз выручки (30 дней)</p>
          <p className="mt-1 text-2xl font-extrabold">+8.5%</p>
          <div className="mt-3 flex items-end gap-1">
            {miniTrend.map((point, idx) => (
              <div key={`${point}-${idx}`} className="w-4 rounded-t-md bg-cyan-500/70" style={{ height: `${point}px` }} />
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs text-muted">Утечки денег</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">3 зоны</p>
          <p className="text-xs text-muted">Канал маркетплейса и 1 убыточный SKU требуют действий.</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboards.map((dashboard, idx) => (
          <Card key={dashboard.id} className={`animate-fade-up bg-gradient-to-br ${dashboard.tone}`}>
            <p className="mb-1 text-xs text-muted">Панель #{idx + 1}</p>
            <h3 className="mb-1 text-base font-semibold">{dashboard.name}</h3>
            <p className="mb-3 text-xs text-muted">Обновлено: {dashboard.updatedAt}</p>
            <div className="mb-4 flex items-end gap-1">
              {[20, 26, 24, 30, 33, 36, 38].map((bar, barIdx) => (
                <div key={barIdx} className="w-3 rounded-sm bg-slate-700/70" style={{ height: `${bar + ((idx % 3) * 6)}px` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white">Открыть</button>
              <button className="rounded-xl border border-border bg-white px-3 py-2 text-sm">Редактировать</button>
              <Link href="/ai" className="rounded-xl border border-border bg-white px-3 py-2 text-sm">AI-виджет</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
