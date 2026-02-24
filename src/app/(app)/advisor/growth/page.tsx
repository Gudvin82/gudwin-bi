import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function AdvisorGrowthPage() {
  return (
    <ModulePageShell
      title="Идеи роста"
      subtitle="AI-бэклог гипотез по росту выручки, ROMI и LTV с оценкой эффекта и сложности."
      whatItDoes={[
        "Формирует список гипотез на основе текущих метрик.",
        "Показывает ожидаемый эффект до запуска инициативы.",
        "Позволяет отслеживать статус реализации идей."
      ]}
      status="v2"
      blocks={[
        {
          title: "Новые гипотезы",
          description: "Приоритезируются по потенциальному эффекту и трудозатратам."
        },
        {
          title: "Результат после внедрения",
          description: "Сравнение метрик до/после по реализованным инициативам."
        }
      ]}
    />
  );
}
