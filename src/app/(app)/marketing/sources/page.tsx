"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Source = { id: string; name: string; status: "connected" | "needs_refresh" | "error"; lastSync: string };

export default function MarketingSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [social, setSocial] = useState({
    vkGroup: "",
    telegramChannel: "",
    maxChannel: ""
  });
  const [yandexLogin, setYandexLogin] = useState("");
  const [yandexClientId, setYandexClientId] = useState("");
  const [yandexToken, setYandexToken] = useState("");
  const [yandexStatus, setYandexStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketing/sources");
      const json = await res.json();
      setSources(json.sources ?? []);
    };
    void load();
  }, []);

  const connectYandex = async () => {
    setYandexStatus("");
    try {
      const res = await fetch("/api/marketing/yandex/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: yandexLogin,
          clientId: yandexClientId,
          token: yandexToken
        })
      });
      if (!res.ok) throw new Error("Ошибка подключения Яндекс.Директ.");
      const json = await res.json();
      setYandexStatus(json.note ?? "Яндекс.Директ подключен. Синхронизация начнётся через 5 минут.");
      setYandexLogin("");
      setYandexClientId("");
      setYandexToken("");
    } catch {
      setYandexStatus("Не удалось подключить Яндекс.Директ. Проверьте логин и токен.");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Источники маркетинга</h2>
            <p className="text-sm text-muted">Подключите рекламные аккаунты, чтобы видеть реальные расходы, лиды и сделки по каналам.</p>
          </div>
          <HelpPopover
            title="Зачем подключать источники"
            items={[
              "Без интеграций отчеты будут неполными.",
              "Проверяйте статус синхронизации и обновляйте доступы.",
              "При ошибках используйте переподключение."
            ]}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Соцсети для анализа маркетинга</h3>
        <p className="mb-3 text-sm text-muted">
          Подключите площадки, чтобы видеть охваты, лиды и влияние контента на выручку.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-border p-2.5 text-sm"
            placeholder="VK сообщество / ID"
            value={social.vkGroup}
            onChange={(event) => setSocial((prev) => ({ ...prev, vkGroup: event.target.value }))}
          />
          <input
            className="rounded-xl border border-border p-2.5 text-sm"
            placeholder="Telegram канал / @username"
            value={social.telegramChannel}
            onChange={(event) => setSocial((prev) => ({ ...prev, telegramChannel: event.target.value }))}
          />
          <input
            className="rounded-xl border border-border p-2.5 text-sm"
            placeholder="MAX канал / ID"
            value={social.maxChannel}
            onChange={(event) => setSocial((prev) => ({ ...prev, maxChannel: event.target.value }))}
          />
        </div>
        <button className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">
          Сохранить подключения соцсетей
        </button>
      </Card>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Яндекс.Директ</h3>
        <p className="mb-3 text-sm text-muted">
          Подключите рекламный кабинет, чтобы получать расходы, клики и конверсии по кампаниям.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-border p-2.5 text-sm"
            placeholder="Логин в Яндекс.Директ"
            value={yandexLogin}
            onChange={(event) => setYandexLogin(event.target.value)}
          />
          <input
            className="rounded-xl border border-border p-2.5 text-sm"
            placeholder="Client ID приложения"
            value={yandexClientId}
            onChange={(event) => setYandexClientId(event.target.value)}
          />
          <input
            className="rounded-xl border border-border p-2.5 text-sm"
            placeholder="OAuth токен"
            value={yandexToken}
            onChange={(event) => setYandexToken(event.target.value)}
          />
        </div>
        <button onClick={connectYandex} className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white">
          Подключить Яндекс.Директ
        </button>
        {yandexStatus ? <p className="mt-2 text-xs text-muted">{yandexStatus}</p> : null}
      </Card>

      <div className="space-y-2">
        {sources.map((source) => (
          <Card key={source.id} className="bg-white/90">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{source.name}</p>
                <p className="text-xs text-muted">Последняя синхронизация: {source.lastSync}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <span className={`rounded-lg px-2 py-1 ${source.status === "connected" ? "bg-emerald-100 text-emerald-700" : source.status === "needs_refresh" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                  {source.status === "connected" ? "Подключен" : source.status === "needs_refresh" ? "Требуется обновление" : "Ошибка"}
                </span>
                <button className="rounded-lg border border-border px-2 py-1">Переподключить</button>
                <button className="rounded-lg border border-border px-2 py-1">Настройки</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
