import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const links = [
  { href: "/ai", title: "AI-вопрос к данным", note: "Сформулируйте запрос простым текстом и получите отчет" },
  { href: "/sources", title: "Источники данных", note: "Подключение Google Sheets, CSV, CRM и API" },
  { href: "/dashboards", title: "Дашборды", note: "Готовые демо-панели и пользовательские отчеты" },
  { href: "/docs", title: "Документы и право", note: "Проверка контрагентов и кандидатов, краткая сводка рисков" },
  { href: "/hire", title: "Найм", note: "Генерация заявок и базовый скрининг" },
  { href: "/agents", title: "Агенты", note: "Каталог и запуск AI-агентов" },
  { href: "/connect", title: "Интеграции", note: "Связи с внешними сервисами и правила «если → то»" },
  { href: "/learn", title: "Обучение и FAQ", note: "Подсказки, сценарии и AI-справка" },
  { href: "/competitor", title: "Конкуренты", note: "Сигналы рынка и рекомендации" },
  { href: "/desktop-agent", title: "Десктоп AI-агент (v2+)", note: "Архитектура и дорожная карта локального агента" },
  { href: "/settings", title: "Настройки", note: "Telegram, SMS, интеграции и режимы уведомлений" },
  { href: "/contacts", title: "Контакты разработки", note: "Связь с командой и заявки на доработки" }
];

export default function ServicesPage() {
  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-slate-50 to-zinc-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Сервисы и модули</h2>
            <p className="text-sm text-muted">Дополнительные разделы платформы. Основной ежедневный сценарий: Режим владельца → Финансы → Мониторинг.</p>
          </div>
          <HelpPopover
            title="Что здесь"
            items={[
              "Здесь собраны дополнительные модули, чтобы не перегружать главное меню.",
              "Если вы заходите впервые, начните с Режима владельца.",
              "Для подключения данных откройте «Источники данных»."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {links.map((item) => (
          <Card key={item.href} className="animate-fade-up">
            <h3 className="mb-1 text-base font-semibold">{item.title}</h3>
            <p className="mb-3 text-sm text-muted">{item.note}</p>
            <Link href={item.href} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
              Открыть раздел
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
