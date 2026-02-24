import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function IntegrationsHubPage() {
  return (
    <ModulePageShell
      title="Интеграции"
      subtitle="Шина подключений: внешние системы, AI-агенты, конкурентный мониторинг и синхронизация данных."
      whatItDoes={[
        "Показывает подключенные системы и их статус.",
        "Дает доступ к каталогу агентов и конкурентной аналитике.",
        "Хранит правила интеграционных действий по событиям."
      ]}
      blocks={[
        {
          title: "Подключенные системы",
          description: "Источники данных, webhook-правила и журналы синхронизации.",
          href: "/connect",
          hrefLabel: "Открыть подключения"
        },
        {
          title: "AI-агенты",
          description: "Типовые и кастомные агенты для поддержки, продаж, HR и финансов.",
          href: "/agents",
          hrefLabel: "Открыть агентов"
        }
      ]}
    />
  );
}
