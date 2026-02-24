import Link from "next/link";
import { Card } from "@/components/ui/card";

const dashboards = [
  { id: "sales-main", name: "Продажи и выручка", updatedAt: "сегодня" },
  { id: "funnel", name: "Воронка лидов", updatedAt: "вчера" }
];

export default function DashboardsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {dashboards.map((dashboard) => (
        <Card key={dashboard.id}>
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
  );
}
