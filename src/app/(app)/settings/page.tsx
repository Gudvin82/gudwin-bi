"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

type AccessRole = "owner" | "admin" | "member" | "viewer";

const roleLabels: Record<AccessRole, string> = {
  owner: "Владелец",
  admin: "Администратор",
  member: "Сотрудник",
  viewer: "Наблюдатель"
};

const sectionPermissions = [
  { section: "Режим владельца", owner: true, admin: true, member: false, viewer: true },
  { section: "Финансы", owner: true, admin: true, member: true, viewer: true },
  { section: "Маркетинг", owner: true, admin: true, member: true, viewer: true },
  { section: "AI-советник", owner: true, admin: true, member: true, viewer: false },
  { section: "Дашборды и отчеты", owner: true, admin: true, member: true, viewer: true },
  { section: "Юридический блок", owner: true, admin: true, member: false, viewer: false },
  { section: "Интеграции и ключи", owner: true, admin: true, member: false, viewer: false },
  { section: "Настройки доступов", owner: true, admin: false, member: false, viewer: false }
] as const;

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AccessRole>("member");
  const [inviteHint, setInviteHint] = useState("");

  const roleDescription = useMemo(() => {
    if (role === "owner") return "Полный доступ ко всем разделам, ключам и правам.";
    if (role === "admin") return "Управление модулями и интеграциями без смены владельца.";
    if (role === "member") return "Рабочий доступ к аналитике, маркетингу и советнику.";
    return "Только просмотр ключевых метрик и дашбордов.";
  }, [role]);

  const onInvite = () => {
    setInviteHint("Приглашение сохранено как заглушка. Реальная отправка будет подключена на следующем этапе.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Выдача доступа к сервису</h2>
        <p className="mb-3 text-sm text-muted">
          Добавляйте сотрудников и партнёров в рабочее пространство. Роли настроены под разделы продукта.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-border p-2.5 text-sm md:col-span-2"
            placeholder="Email нового участника"
          />
          <select value={role} onChange={(event) => setRole(event.target.value as AccessRole)} className="rounded-xl border border-border p-2.5 text-sm">
            <option value="owner">owner / владелец</option>
            <option value="admin">admin / администратор</option>
            <option value="member">member / сотрудник</option>
            <option value="viewer">viewer / наблюдатель</option>
          </select>
        </div>
        <p className="mt-2 text-xs text-muted">{roleDescription}</p>
        <button onClick={onInvite} className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">
          Отправить приглашение
        </button>
        {inviteHint ? <p className="mt-2 text-xs text-amber-700">{inviteHint}</p> : null}

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>owner@gudwin.bi</span>
            <span className="text-muted">owner</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>ops@gudwin.bi</span>
            <span className="text-muted">admin</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>analyst@gudwin.bi</span>
            <span className="text-muted">member</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Права доступа по разделам</h2>
        <p className="mb-3 text-sm text-muted">Матрица прав для текущего этапа. В проде будет сохранение в базу и аудит изменений.</p>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="pb-2">Раздел</th>
                <th className="pb-2">Владелец</th>
                <th className="pb-2">Администратор</th>
                <th className="pb-2">Сотрудник</th>
                <th className="pb-2">Наблюдатель</th>
              </tr>
            </thead>
            <tbody>
              {sectionPermissions.map((row) => (
                <tr key={row.section} className="border-t border-border">
                  <td className="py-2 font-medium">{row.section}</td>
                  <td className="py-2">{row.owner ? "✓" : "—"} {roleLabels.owner}</td>
                  <td className="py-2">{row.admin ? "✓" : "—"} {roleLabels.admin}</td>
                  <td className="py-2">{row.member ? "✓" : "—"} {roleLabels.member}</td>
                  <td className="py-2">{row.viewer ? "✓" : "—"} {roleLabels.viewer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Telegram агент</h2>
        <p className="mb-3 text-sm text-muted">1) Создайте бота через BotFather 2) Вставьте токен 3) Укажите chat_id для ежедневных отчётов.</p>
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
    </div>
  );
}
