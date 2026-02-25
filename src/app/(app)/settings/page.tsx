"use client";

import { useEffect, useMemo, useState } from "react";
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
  { section: "ИИ-советник", owner: true, admin: true, member: true, viewer: false },
  { section: "Дашборды и отчеты", owner: true, admin: true, member: true, viewer: true },
  { section: "Юр отдел", owner: true, admin: true, member: false, viewer: false },
  { section: "Интеграции и ключи", owner: true, admin: true, member: false, viewer: false },
  { section: "Настройки доступов", owner: true, admin: false, member: false, viewer: false }
] as const;

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("Анатолий Гудвин");
  const [profileRole, setProfileRole] = useState<AccessRole>("owner");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AccessRole>("member");
  const [inviteHint, setInviteHint] = useState("");
  const [profileHint, setProfileHint] = useState("");
  const [authHint, setAuthHint] = useState("");

  const roleDescription = useMemo(() => {
    if (role === "owner") return "Полный доступ ко всем разделам, ключам и правам.";
    if (role === "admin") return "Управление модулями и интеграциями без смены владельца.";
    if (role === "member") return "Рабочий доступ к аналитике, маркетингу и советнику.";
    return "Только просмотр ключевых метрик и дашбордов.";
  }, [role]);

  const onInvite = () => {
    setInviteHint("Приглашение сохранено. Отправка приглашений будет доступна после подключения почтового провайдера.");
  };

  const saveAuthStub = () => {
    setAuthHint("Способы входа сохранены. После подключения провайдера авторизации они будут активированы.");
  };

  const saveProfile = () => {
    localStorage.setItem("gw_profile_name", profileName);
    localStorage.setItem("gw_profile_role", profileRole);
    localStorage.setItem("gw_theme", themeMode);
    localStorage.setItem("gw_lang", language);
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("lang", language === "ru" ? "ru" : "en");
    setProfileHint(
      themeMode === "dark"
        ? "Профиль сохранён. Тёмная тема временно отключена и будет включена в следующем релизе."
        : "Профиль и предпочтения интерфейса сохранены."
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("gw_profile_name");
      const savedRole = localStorage.getItem("gw_profile_role") as AccessRole | null;
      const savedTheme = localStorage.getItem("gw_theme") as "light" | "dark" | null;
      const savedLang = localStorage.getItem("gw_lang") as "ru" | "en" | null;
      if (savedName) setProfileName(savedName);
      if (savedRole) setProfileRole(savedRole);
      if (savedTheme) setThemeMode(savedTheme);
      if (savedLang) setLanguage(savedLang);
    }
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Разделы настроек</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <a href="/settings/requisites" className="rounded-xl border border-border bg-slate-50 p-3 text-sm font-semibold hover:bg-slate-100">
            Мои реквизиты
            <p className="mt-1 text-xs font-normal text-muted">Юрлица, ИНН/КПП, банковские данные и адреса.</p>
          </a>
          <a href="/settings/ai-keys" className="rounded-xl border border-border bg-slate-50 p-3 text-sm font-semibold hover:bg-slate-100">
            ИИ-провайдеры и ключи
            <p className="mt-1 text-xs font-normal text-muted">Статус подключений и затраты по моделям.</p>
          </a>
          <a href="/settings/simple" className="rounded-xl border border-border bg-slate-50 p-3 text-sm font-semibold hover:bg-slate-100">
            Режим «Объяснить просто»
            <p className="mt-1 text-xs font-normal text-muted">Человеческие пояснения отчетов для собственника.</p>
          </a>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Профиль аккаунта и интерфейс</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs text-muted">ФИО аккаунта</label>
            <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted">Роль доступа (отображение в шапке)</label>
            <select value={profileRole} onChange={(event) => setProfileRole(event.target.value as AccessRole)} className="w-full rounded-xl border border-border p-2.5 text-sm">
              <option value="owner">Владелец</option>
              <option value="admin">Администратор</option>
              <option value="member">Сотрудник</option>
              <option value="viewer">Наблюдатель</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted">Тема</label>
            <select value={themeMode} onChange={(event) => setThemeMode(event.target.value as "light" | "dark")} className="w-full rounded-xl border border-border p-2.5 text-sm">
              <option value="light">Светлая (по умолчанию)</option>
              <option value="dark">Лёгкая тёмная</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted">Язык интерфейса</label>
            <select value={language} onChange={(event) => setLanguage(event.target.value as "ru" | "en")} className="w-full rounded-xl border border-border p-2.5 text-sm">
              <option value="ru">Русский (по умолчанию)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        <button onClick={saveProfile} className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">Сохранить профиль</button>
        {profileHint ? <p className="mt-2 text-xs text-emerald-700">{profileHint}</p> : null}
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Авторизация</h2>
        <p className="mb-3 text-sm text-muted">
          Выберите способы входа, которые будут включены на следующем этапе: телефон, email, Telegram.
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          <label className="inline-flex items-center gap-2 rounded-xl border border-border p-3 text-sm">
            <input type="checkbox" defaultChecked />
            Вход по номеру телефона
          </label>
          <label className="inline-flex items-center gap-2 rounded-xl border border-border p-3 text-sm">
            <input type="checkbox" defaultChecked />
            Вход по email
          </label>
          <label className="inline-flex items-center gap-2 rounded-xl border border-border p-3 text-sm">
            <input type="checkbox" defaultChecked />
            Вход через Telegram
          </label>
        </div>
        <button onClick={saveAuthStub} className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">
          Сохранить способы входа
        </button>
        {authHint ? <p className="mt-2 text-xs text-amber-700">{authHint}</p> : null}
      </Card>

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
            <option value="owner">Владелец</option>
            <option value="admin">Администратор</option>
            <option value="member">Сотрудник</option>
            <option value="viewer">Наблюдатель</option>
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
            <span className="text-muted">Владелец</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>ops@gudwin.bi</span>
            <span className="text-muted">Администратор</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>analyst@gudwin.bi</span>
            <span className="text-muted">Сотрудник</span>
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
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${row.owner ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {row.owner ? "Доступ" : "Нет доступа"} ({roleLabels.owner})
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${row.admin ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {row.admin ? "Доступ" : "Нет доступа"} ({roleLabels.admin})
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${row.member ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {row.member ? "Доступ" : "Нет доступа"} ({roleLabels.member})
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${row.viewer ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {row.viewer ? "Доступ" : "Нет доступа"} ({roleLabels.viewer})
                    </span>
                  </td>
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
