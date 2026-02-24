import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function AdvisorJournalPage() {
  return (
    <ModulePageShell
      title="Дневник бизнеса"
      subtitle="Хронология управленческих решений и их влияния на ключевые показатели."
      whatItDoes={[
        "Фиксирует важные события бизнеса в единой ленте.",
        "Показывает причинно-следственные связи по метрикам.",
        "Помогает извлекать повторяемые управленческие уроки."
      ]}
      status="v2"
      blocks={[
        {
          title: "События и решения",
          description: "Автоматическая запись изменений, запусков кампаний и ключевых действий."
        },
        {
          title: "Выводы по циклам",
          description: "Что сработало, что не сработало и что стоит повторить."
        }
      ]}
    />
  );
}
