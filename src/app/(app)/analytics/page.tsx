import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function AnalyticsHubPage() {
  return (
    <ModulePageShell
      title="Аналитика"
      subtitle="Рабочий центр дашбордов и источников данных: от загрузки до сохранения готовых виджетов."
      whatItDoes={[
        "Открывайте и редактируйте дашборды.",
        "Подключайте источники данных и проверяйте статус синхронизации.",
        "Используйте отраслевые шаблоны для быстрого старта."
      ]}
      blocks={[
        {
          title: "Мои дашборды",
          description: "Галерея ключевых экранов по финансам, продажам, отделам и владельцу.",
          href: "/dashboards",
          hrefLabel: "Открыть дашборды"
        },
        {
          title: "Источники данных",
          description: "Подключение таблиц, CRM и API для обновления аналитики.",
          href: "/sources",
          hrefLabel: "Подключить данные"
        }
      ]}
    />
  );
}
