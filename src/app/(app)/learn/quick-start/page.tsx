import Link from "next/link";
import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "1. Подключите источник данных",
    description: "Добавьте Google Таблицы, CSV/Excel или CRM-вебхук, чтобы система увидела фактические цифры бизнеса.",
    action: { href: "/sources", label: "Смотреть инструкцию" }
  },
  {
    title: "2. Получите первый дашборд",
    description: "После синхронизации GudWin BI автоматически соберёт стартовые виджеты по продажам, деньгам и рискам.",
    action: { href: "/dashboards", label: "Открыть дашборды" }
  },
  {
    title: "3. Задайте вопрос ИИ-советнику",
    description: "Примеры: «Где я теряю больше всего денег?»; «Покажи прогноз кассового разрыва на 30 дней»; «Какие каналы сейчас убыточны?»",
    action: { href: "/advisor", label: "Открыть ИИ-советник" }
  },
  {
    title: "4. Сохраните полезный виджет",
    description: "Сохраните результат ИИ-анализа в дашборд, чтобы ключевые метрики были перед глазами каждый день.",
    action: { href: "/dashboards/builder", label: "Открыть конструктор дашбордов" }
  }
];

export default function LearnQuickStartPage() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-emerald-50 to-cyan-50">
        <h2 className="text-2xl font-extrabold tracking-tight">Быстрый старт</h2>
        <p className="mt-1 text-sm text-muted">Сценарий, который помогает получить первую практическую пользу за 5–10 минут.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.title}>
            <h3 className="text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
            <Link href={step.action.href} className="mt-3 inline-flex rounded-xl border border-border px-3 py-2 text-sm font-medium">
              {step.action.label}
            </Link>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-base font-semibold">Что дальше?</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Link href="/owner" className="rounded-xl border border-border bg-slate-50 p-3 text-sm">
            <p className="font-semibold">Для собственника</p>
            <p className="text-muted">Откройте Режим владельца и начните с главной проблемы недели.</p>
          </Link>
          <Link href="/finance" className="rounded-xl border border-border bg-slate-50 p-3 text-sm">
            <p className="font-semibold">Для финансиста/маркетолога</p>
            <p className="text-muted">Перейдите в финансы и маркетинг, чтобы углубиться в показатели по каналам и деньгам.</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
