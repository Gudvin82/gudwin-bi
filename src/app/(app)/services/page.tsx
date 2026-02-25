import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const links = [
  { href: "/ai", title: "ИИ-вопрос к данным", note: "Сформулируйте запрос простым текстом и получите отчёт" },
  { href: "/sources", title: "Источники данных", note: "Подключение Google Таблиц, CSV, CRM и API" },
  { href: "/dashboards", title: "Дашборды", note: "Готовые панели и пользовательские отчёты" },
  { href: "/docs", title: "Документы и право", note: "Проверка контрагентов и кандидатов, краткая сводка рисков" },
  { href: "/hire", title: "Найм", note: "Генерация заявок и базовый скрининг" },
  { href: "/agents", title: "Агенты", note: "Каталог и запуск ИИ-агентов" },
  { href: "/connect", title: "Интеграции", note: "Связи с внешними сервисами и правила «если → то»" },
  { href: "/learn", title: "Обучение и FAQ", note: "Подсказки, сценарии и ИИ-справка" },
  { href: "/competitor", title: "Конкуренты", note: "Сигналы рынка и рекомендации" },
  { href: "/desktop-agent", title: "Десктоп ИИ-агент", note: "Концепция локального агента и обзор возможностей" },
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
            <p className="text-sm text-muted">Дополнительные разделы платформы для углубления анализа и внедрения. Базовый маршрут: Режим владельца → Финансы → Мониторинг.</p>
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

      <Card className="bg-gradient-to-r from-violet-50 via-cyan-50 to-emerald-50">
        <h3 className="mb-2 text-lg font-extrabold">Расширенные возможности</h3>
        <p className="text-sm text-muted">Инструменты, которые усиливают ежедневную работу: ассистент, автозапуск сценариев и журнал действий.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-muted">ИИ-помощник</p>
            <p className="mt-1 text-sm font-semibold">Команды + подтверждение действий</p>
            <p className="mt-1 text-xs text-slate-500">Готов для настройки под ваш процесс</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-muted">Action Engine</p>
            <p className="mt-1 text-sm font-semibold">Если условие → запустить задачу</p>
            <p className="mt-1 text-xs text-slate-500">Автоматизирует рутинные действия</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-muted">Журнал команд</p>
            <p className="mt-1 text-sm font-semibold">Кто и что запускал через ИИ</p>
            <p className="mt-1 text-xs text-slate-500">Прозрачность и контроль решений</p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50">
        <h3 className="mb-2 text-lg font-extrabold">Отчетность и контроль</h3>
        <p className="text-sm text-muted">Расширенные отчеты, сравнение периодов и автоматические рассылки для руководителя.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {[
            "Сравнение периодов (YoY/MoM)",
            "Авто-отчеты по расписанию",
            "Экспорт PDF/Excel в 1 клик",
            "Уведомления с приоритетами"
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold">{item}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
