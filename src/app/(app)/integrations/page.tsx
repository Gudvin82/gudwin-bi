"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Integration = { id: string; type: string; status: string; lastSync: string };

const availableCatalog = [
  { id: "google_sheets", name: "Google Sheets", note: "Таблицы продаж, расходы, KPI" },
  { id: "bitrix24", name: "Bitrix24 CRM", note: "Сделки, лиды, воронка" },
  { id: "moysklad", name: "МойСклад", note: "Товары, остатки, заказы" },
  { id: "yandex_direct", name: "Яндекс.Директ", note: "Расходы, клики, кампании" },
  { id: "vk_ads", name: "VK Реклама", note: "Охваты, лиды, ROMI" },
  { id: "webhook", name: "Вебхук / API", note: "Кастомные события из ваших систем" }
];

export default function IntegrationsHubPage() {
  const [connected, setConnected] = useState<Integration[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/connect/integrations");
        if (!res.ok) {
          setMessage("Не удалось загрузить интеграции. Попробуйте обновить страницу.");
          return;
        }
        const json = await res.json();
        setConnected(json.integrations ?? []);
      } catch {
        setMessage("Не удалось загрузить интеграции. Попробуйте обновить страницу.");
      }
    };
    void load();
  }, []);

  const onConnect = (id: string) => {
    setMessage(`Интеграция ${id} добавлена в очередь подключения.`);
  };

  const onAction = (label: string) => {
    setMessage(`Действие «${label}» выполнено в демо-режиме. Функция будет активна после подключения.`);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-sky-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Интеграции</h2>
            <p className="text-sm text-muted">
              Единый центр управления подключенными и доступными системами: CRM, реклама, таблицы и вебхуки.
            </p>
          </div>
          <HelpPopover
            title="Что есть в разделе"
            items={[
              "Список всех уже подключенных систем и их статус синхронизации.",
              "Каталог доступных подключений, которые можно включить сразу.",
              "Кнопка заказа дополнительной интеграции под ваш бизнес."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Уже подключено</h3>
          <div className="space-y-2">
            {connected.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{item.type}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{item.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Последняя синхронизация: {item.lastSync}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => onAction("Настроить")} className="rounded-lg border border-border px-2 py-1 text-xs">Настроить</button>
                  <button onClick={() => onAction("Обновить синхронизацию")} className="rounded-lg border border-border px-2 py-1 text-xs">Обновить синхронизацию</button>
                  <button onClick={() => onAction("Отключить")} className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700">Отключить</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Можно подключить</h3>
          <div className="space-y-2">
            {availableCatalog.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{item.name}</p>
                  <button onClick={() => onConnect(item.id)} className="rounded-lg bg-accent px-2 py-1 text-xs font-semibold text-white">
                    Подключить
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/connect" className="rounded-xl border border-border px-3 py-2 text-sm font-semibold">
              Открыть сценарии «если → то»
            </Link>
            <Link href="/contacts" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white">
              Заказать доп. интеграцию
            </Link>
          </div>
          {message ? <p className="mt-2 text-xs text-emerald-700">{message}</p> : null}
        </Card>
      </div>
    </div>
  );
}
