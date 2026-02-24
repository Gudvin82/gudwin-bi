import { ModulePageShell } from "@/components/layout/module-page-shell";

export default function SettingsSimplePage() {
  return (
    <ModulePageShell
      title="Режим «Объяснить просто»"
      subtitle="Преобразование сложной аналитики в понятные текстовые брифинги для собственника."
      whatItDoes={[
        "Переводит отчеты на простой русский язык.",
        "Убирает лишние термины и акцентирует управленческий смысл.",
        "Готовит основу для голосового брифинга (v2+)."
      ]}
      blocks={[
        {
          title: "Текстовые брифинги",
          description: "Короткие сводки без перегруза цифрами и техническими деталями."
        },
        {
          title: "Утренний формат",
          description: "Связка с ежедневным брифингом в разделе Мониторинг.",
          href: "/watch",
          hrefLabel: "Открыть мониторинг"
        }
      ]}
    />
  );
}
