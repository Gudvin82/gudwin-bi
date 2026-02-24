import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Telegram агент</h2>
        <p className="mb-3 text-sm text-muted">1) Создайте бота через BotFather 2) Вставьте токен 3) Укажите chat_id для ежедневных отчетов.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Bot token (encrypted)" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Default chat_id" />
        </div>
        <button className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Сохранить Telegram настройки</button>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">SMS провайдер</h2>
        <p className="mb-3 text-sm text-muted">Добавьте провайдера и включите короткий KPI-дайджест, например каждый день в 21:00.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Provider name" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="API key (encrypted)" />
        </div>
        <button className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Сохранить SMS настройки</button>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Логи интеграций</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>2026-02-24 08:00: CRM sync success (bitrix24) - 1,290 rows</li>
          <li>2026-02-24 07:45: SMS job queued - KPI digest</li>
          <li>2026-02-23 22:10: Telegram report sent - Daily summary</li>
        </ul>
      </Card>
    </div>
  );
}
