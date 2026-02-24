import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const dashboards = [
  { id: "sales-main", name: "Продажи и выручка", updatedAt: "сегодня" },
  { id: "funnel", name: "Воронка лидов", updatedAt: "вчера" },
  { id: "owner", name: "Сводка режима владельца", updatedAt: "сегодня" },
  { id: "finance", name: "Касса и юнит-экономика", updatedAt: "сегодня" },
  { id: "departments", name: "KPI отделов и индекс эффективности", updatedAt: "2 часа назад" },
  { id: "marketing", name: "ROMI и рекламные каналы", updatedAt: "30 минут назад" }
];

export default function DashboardsPage() {
  if (!dashboards.length) {
    return (
      <Card>
        <h3 className="mb-2 text-lg font-semibold">Пока нет дашбордов</h3>
        <p className="mb-3 text-sm text-muted">
          Подключите источник данных и GudWin BI автоматически создаст первый дашборд.
        </p>
        <div className="flex gap-2">
          <Link href="/sources" className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">
            Подключить данные
          </Link>
          <Link href="/onboarding" className="rounded-xl border border-border px-3 py-2 text-sm font-semibold">
            Открыть onboarding
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
        <Card className="bg-gradient-to-r from-sky-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Демо-галерея дашбордов</h3>
            <p className="text-sm text-muted">Разные ракурсы для инвесторского показа: финансы, операции, маркетинг и экран собственника.</p>
          </div>
          <HelpPopover
            title="Подсказка"
            items={[
              "Откройте дашборд, чтобы посмотреть ключевые показатели по конкретной теме.",
              "Если данных нет, сначала подключите источник в разделе «Источники данных».",
              "Можно добавлять AI-виджеты для кастомной аналитики."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
      {dashboards.map((dashboard) => (
        <Card key={dashboard.id} className="animate-fade-up">
          <h3 className="mb-1 text-lg font-semibold">{dashboard.name}</h3>
          <p className="mb-4 text-sm text-muted">Обновлено: {dashboard.updatedAt}</p>
          <div className="flex gap-2">
            <button className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white">Открыть</button>
            <button className="rounded-xl border border-border px-3 py-2 text-sm">Редактировать</button>
            <Link href="/ai" className="rounded-xl border border-border px-3 py-2 text-sm">
              Добавить AI-виджет
            </Link>
          </div>
        </Card>
      ))}
      </div>
    </div>
  );
}
