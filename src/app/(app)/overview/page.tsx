import { KpiTable } from "@/components/dashboard/kpi-table";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Card } from "@/components/ui/card";

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <div className="dashboard-grid">
        <div className="col-span-12 md:col-span-4">
          <MetricCard title="Выручка" value="3 950 000 ₽" delta="+18% к прошлому месяцу" />
        </div>
        <div className="col-span-12 md:col-span-4">
          <MetricCard title="Сделки" value="1 482" delta="+7.3%" />
        </div>
        <div className="col-span-12 md:col-span-4">
          <MetricCard title="Средний чек" value="3 215 ₽" delta="+2.1%" />
        </div>
      </div>

      <div className="dashboard-grid">
        <RevenueChart />
        <KpiTable />
      </div>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Онбординг</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Подключите Google Sheets, CRM webhook или загрузите Excel/CSV.</li>
          <li>Система автоматически предложит стартовый дашборд.</li>
          <li>Сформулируйте задачу в AI-блоке и сохраните результат как виджет.</li>
        </ol>
      </Card>
    </div>
  );
}
