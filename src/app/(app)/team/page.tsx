import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function TeamPage() {
  return (
    <ModulePageShell
      title="Команда"
      subtitle="Единый раздел для сотрудников, кандидатов и базовой операционной аналитики по людям."
      whatItDoes={[
        "Хранит текущий состав и статусы кандидатов.",
        "Связывает найм, KPI и загрузку отделов.",
        "Дает быстрый переход к проверкам и аналитике команды."
      ]}
      blocks={[
        {
          title: "Подбор сотрудников",
          description: "Генерация заявок и базовый скрининг кандидатов.",
          href: "/hire",
          hrefLabel: "Открыть подбор"
        },
        {
          title: "Аналитика команды",
          description: "Перегрузка, недогрузка, узкие места и риск выгорания.",
          href: "/team/insights",
          hrefLabel: "Открыть инсайты"
        }
      ]}
    />
  );
}
