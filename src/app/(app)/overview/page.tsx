import Link from "next/link";
import { KpiTable } from "@/components/dashboard/kpi-table";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ContextHelpLinks } from "@/components/learn/context-help-links";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50">
        <p className="text-sm font-semibold">Подключите свои данные и запустите боевой контур аналитики.</p>
        <p className="text-sm text-muted">Google Sheets/CSV/CRM webhook: после подключения система сформирует стартовый дашборд и AI-рекомендации.</p>
        <div className="mt-3 flex gap-2">
          <Link href="/sources" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white">
            Подключить источник
          </Link>
          <Link href="/onboarding" className="rounded-xl border border-cyan-300 bg-white px-3 py-2 text-sm font-semibold text-cyan-700">
            Открыть быстрый старт
          </Link>
        </div>
      </Card>

      <div className="dashboard-grid">
        <div className="col-span-12">
          <Card className="animate-fade-up bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-cyan-100">Индекс здоровья бизнеса</p>
                <p className="text-4xl font-extrabold">78 / 100</p>
                <p className="text-sm text-slate-200">Главный риск: кассовый разрыв в следующем месяце при текущей дебиторке.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/owner" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                  Открыть Режим владельца
                </Link>
                <Link href="/finance" className="rounded-xl border border-white/35 px-4 py-2 text-sm font-semibold text-white">
                  Перейти в Финансы
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <MetricCard title="Выручка" value="3 950 000 ₽" delta="+18% к прошлому месяцу" />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <MetricCard title="Сделки" value="1 482" delta="+7.3%" />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <MetricCard title="Средний чек" value="3 215 ₽" delta="+2.1%" />
        </div>
      </div>

      <div className="dashboard-grid">
        <RevenueChart />
        <KpiTable />
      </div>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-base font-semibold">Быстрый старт</h3>
          <HelpPopover
            title="С чего начать"
            items={[
              "Подключите источник данных: Google Sheets, CRM или файл.",
              "Проверьте автоматически созданный дашборд.",
              "Задайте AI-вопрос к данным и сохраните полезный виджет."
            ]}
          />
        </div>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Подключите Google Sheets, CRM webhook или загрузите Excel/CSV.</li>
          <li>Система автоматически предложит стартовый дашборд.</li>
          <li>Сформулируйте задачу в AI-блоке и сохраните результат как виджет.</li>
        </ol>
        <Link href="/onboarding" className="mt-4 inline-flex rounded-xl border border-border px-3 py-2 text-sm font-medium">
          Открыть пошаговый мастер
        </Link>
      </Card>

      <ContextHelpLinks section="owner" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Link href="/finance" className="block">
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50">
            <p className="text-sm font-semibold">Финансовый ракурс</p>
            <p className="mt-2 text-sm text-muted">Кассовый прогноз, юнит-экономика, сценарии и утечки денег. Видно, когда заканчиваются деньги и где уходит маржа.</p>
            <span className="mt-3 inline-flex rounded-lg border border-border px-3 py-2 text-sm">Смотреть</span>
          </Card>
        </Link>
        <Link href="/agents" className="block">
          <Card className="bg-gradient-to-br from-violet-50 to-indigo-50">
            <p className="text-sm font-semibold">Операционный ракурс</p>
            <p className="mt-2 text-sm text-muted">Агенты и правила, которые берут на себя рутину и часть задач команды.</p>
            <span className="mt-3 inline-flex rounded-lg border border-border px-3 py-2 text-sm">Открыть</span>
          </Card>
        </Link>
        <Link href="/advisor" className="block">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
            <p className="text-sm font-semibold">Стратегический ракурс</p>
            <p className="mt-2 text-sm text-muted">AI-консультант и мониторинг подсказывают, где усилить рост и что лучше остановить.</p>
            <span className="mt-3 inline-flex rounded-lg border border-border px-3 py-2 text-sm">Перейти</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
