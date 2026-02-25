import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const steps = [
  {
    title: "1. Подключите данные",
    description: "Google Sheets, Excel/CSV или CRM / вебхук. Достаточно одного источника, чтобы стартовать."
  },
  {
    title: "2. Проверьте автодашборд",
    description: "GudWin BI анализирует структуру колонок и автоматически собирает стартовые виджеты."
  },
  {
    title: "3. Задайте вопрос ИИ",
    description: "Опишите задачу обычным текстом, например: «Покажи выручку по месяцам и средний чек по каналам»."
  },
  {
    title: "4. Включите автоотчеты",
    description: "Настройте отправку коротких сводок в Telegram и SMS по расписанию."
  }
];

export default function OnboardingPage() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="mb-2 text-xl font-bold">Быстрый старт GudWin BI</h2>
            <p className="text-sm text-muted">Цель: получить первый рабочий отчет за 10-15 минут без сложной настройки.</p>
          </div>
          <HelpPopover
            title="Как пройти онбординг"
            items={[
              "Начните с подключения источника.",
              "Проверьте автодашборд и задайте вопрос ИИ.",
              "После этого включите автоотчеты."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.title}>
            <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/sources" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            Перейти к источникам
          </Link>
          <Link href="/ai" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Перейти к ИИ‑запросам
          </Link>
          <Link href="/settings" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
            Настроить Telegram/SMS
          </Link>
        </div>
      </Card>
    </div>
  );
}
