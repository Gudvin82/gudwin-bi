import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Telegram агент</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Bot token (encrypted)" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Default chat_id" />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">SMS провайдер</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Provider name" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="API key (encrypted)" />
        </div>
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
