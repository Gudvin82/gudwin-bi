"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const providers = [
  { id: "aitunnel", name: "AI Tunnel", env: "AITUNNEL_API_KEY", modelEnv: "AI_MODEL" },
  { id: "openai", name: "OpenAI", env: "OPENAI_API_KEY", modelEnv: "AI_MODEL" },
  { id: "anthropic", name: "Anthropic", env: "ANTHROPIC_API_KEY", modelEnv: "ANTHROPIC_MODEL" },
  { id: "openrouter", name: "OpenRouter", env: "OPENROUTER_API_KEY", modelEnv: "OPENROUTER_MODEL" },
  { id: "yandex", name: "YandexGPT", env: "YANDEX_API_KEY", modelEnv: "YANDEX_MODEL" }
];

export default function AiKeysSettingsPage() {
  const [health, setHealth] = useState<{ enabled: boolean; connected: boolean; provider: string; model: string } | null>(null);
  const [period, setPeriod] = useState<"day" | "month">("month");
  const usageRows: Array<{ name: string; req: string; tok: string; cost: string }> = [];

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/health");
      if (!res.ok) return;
      const json = await res.json();
      setHealth(json.ai ?? null);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">ИИ-провайдеры и ключи</h2>
            <p className="mt-1 text-sm text-muted">
              Подготовленный контур для подключения разных ИИ-моделей. В текущем релизе ключи задаются на сервере в `.env`.
            </p>
          </div>
          <HelpPopover
            title="Как подключать ИИ"
            items={[
              "Выберите провайдера и задайте ключ в .env.",
              "После запуска проверьте статус соединения ниже.",
              "Расходы и лимиты видны в таблице."
            ]}
          />
        </div>
        <div className="mt-3 rounded-xl border border-border bg-white p-3 text-sm">
          <p className="font-semibold">Статус подключения ИИ</p>
          <p className="text-muted">
            {!health
              ? "Проверяем..."
              : !health.enabled
                ? "ИИ-вызовы отключены политикой безопасности (AI_RUNTIME_ENABLED=false)."
                : health.connected
                  ? `Подключено: ${health.provider} (${health.model})`
                  : "Не подключено: ключ не найден в .env"}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Поддерживаемые провайдеры</h3>
        <div className="space-y-2">
          {providers.map((provider) => (
            <div key={provider.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-semibold">{provider.name}</p>
                <p className="text-xs text-muted">
                  Ключ: <code>{provider.env}</code> • Модель: <code>{provider.modelEnv}</code>
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">Готово к интеграции</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Затраты на ИИ и агентов</h3>
          <select value={period} onChange={(event) => setPeriod(event.target.value as "day" | "month")} className="rounded-xl border border-border p-2 text-sm">
            <option value="day">За день</option>
            <option value="month">За месяц</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Всего по ИИ</p>
            <p className="text-2xl font-extrabold">—</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Агентные задачи</p>
            <p className="text-2xl font-extrabold">—</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted">Средняя стоимость запроса</p>
            <p className="text-2xl font-extrabold">—</p>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-muted">
              <tr>
                <th className="px-3 py-2">Провайдер</th>
                <th className="px-3 py-2">Запросов</th>
                <th className="px-3 py-2">Токены</th>
                <th className="px-3 py-2">Стоимость</th>
                <th className="px-3 py-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {usageRows.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2">{row.req}</td>
                  <td className="px-3 py-2">{row.tok}</td>
                  <td className="px-3 py-2">{row.cost}</td>
                  <td className="px-3 py-2"><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Активно</span></td>
                </tr>
              ))}
              {!usageRows.length ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-sm text-muted">
                    Нет данных по расходам. Подключите ИИ-провайдеров и выполните первые запросы.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <p className="text-sm font-semibold">Безопасность</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-900">
          <li>Не храните ключи в GitHub и фронтенд-коде.</li>
          <li>Ключи задаются только на сервере в `.env`.</li>
          <li>После публикации ключа в чате или логах обязательно делайте ротацию.</li>
        </ul>
      </Card>
    </div>
  );
}
