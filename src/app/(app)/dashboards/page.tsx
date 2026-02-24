import Link from "next/link";
import { Card } from "@/components/ui/card";

const dashboards = [
  { id: "sales-main", name: "Продажи и выручка", updatedAt: "сегодня" },
  { id: "funnel", name: "Воронка лидов", updatedAt: "вчера" },
  { id: "owner", name: "Owner Mode Summary", updatedAt: "сегодня" },
  { id: "finance", name: "Cash Guard и Unit Economics", updatedAt: "сегодня" },
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
        <h3 className="text-lg font-semibold">Демо-галерея дашбордов</h3>
        <p className="text-sm text-muted">Разные ракурсы для инвесторского показа: финансы, операции, маркетинг, owner-view.</p>
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
