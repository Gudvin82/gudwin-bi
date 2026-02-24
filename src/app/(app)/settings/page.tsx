import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Доступы и участники</h2>
        <p className="mb-3 text-sm text-muted">Добавляйте сотрудников и партнеров для входа в рабочее пространство GudWin BI.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-xl border border-border p-2.5 text-sm md:col-span-2" placeholder="Email нового участника" />
          <select className="rounded-xl border border-border p-2.5 text-sm">
            <option>member</option>
            <option>owner</option>
          </select>
        </div>
        <button className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Отправить приглашение</button>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>owner@gudwin.bi</span>
            <span className="text-muted">owner</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>analyst@gudwin.bi</span>
            <span className="text-muted">member</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Telegram агент</h2>
        <p className="mb-3 text-sm text-muted">1) Создайте бота через BotFather 2) Вставьте токен 3) Укажите chat_id для ежедневных отчетов.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Токен бота (шифруется)" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Основной chat_id" />
        </div>
        <button className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Сохранить Telegram настройки</button>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Создать своего чат-бота</h2>
        <p className="mb-3 text-sm text-muted">
          Подключите своего бота к аналитике: бот сможет отвечать по KPI и отправлять сводки в выбранные группы.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Название бота" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Токен бота (шифруется)" />
          <input className="rounded-xl border border-border p-2.5 text-sm md:col-span-2" placeholder="Группы/чаты для аналитики (через запятую: @sales, @owner, -100...)" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Создать и подключить бота</button>
          <button className="rounded-xl border border-border px-3 py-2 text-sm font-semibold">Проверить доступ к группам</button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">SMS провайдер</h2>
        <p className="mb-3 text-sm text-muted">Добавьте провайдера и включите короткий KPI-дайджест, например каждый день в 21:00.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="Название провайдера" />
          <input className="rounded-xl border border-border p-2.5 text-sm" placeholder="API-ключ (шифруется)" />
        </div>
        <button className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Сохранить SMS настройки</button>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Логи интеграций</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>2026-02-24 08:00: Синхронизация CRM успешна (Bitrix24) — 1 290 строк</li>
          <li>2026-02-24 07:45: SMS-задача поставлена в очередь — KPI-дайджест</li>
          <li>2026-02-23 22:10: Telegram-отчет отправлен — Ежедневная сводка</li>
        </ul>
      </Card>
    </div>
  );
}
