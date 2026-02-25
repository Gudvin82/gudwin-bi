import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function AnalyticsTemplatesPage() {
  return (
    <ModulePageShell
      title="Шаблоны по отраслям"
      subtitle="Готовые сценарии под тип бизнеса: метрики, виджеты и стартовые ИИ-подсказки."
      whatItDoes={[
        "Помогает запустить аналитику за 5 минут без ручной настройки.",
        "Создает стартовые дашборды и базовые шаблоны отчетов.",
        "Дает основу для кастомизации под ваш процесс."
      ]}
      blocks={[
        {
          title: "Интернет-магазин",
          description: "GMV, конверсия, средний чек, удержание клиентов."
        },
        {
          title: "Сервисный бизнес",
          description: "Загрузка команды, SLA, маржинальность услуг и повторные продажи."
        }
      ]}
    />
  );
}
