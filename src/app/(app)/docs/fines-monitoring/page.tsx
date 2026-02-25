"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const monthly = [
  { month: "Сен", fines: 7, claims: 2, total: 148000 },
  { month: "Окт", fines: 6, claims: 1, total: 121000 },
  { month: "Ноя", fines: 9, claims: 3, total: 192000 },
  { month: "Дек", fines: 5, claims: 2, total: 116000 },
  { month: "Янв", fines: 4, claims: 1, total: 84000 },
  { month: "Фев", fines: 8, claims: 2, total: 167000 }
];

const services = [
  "Контур.Фокус",
  "СПАРК-Интерфакс",
  "Casebook",
  "СБИС Проверка контрагентов",
  "Банк данных исполнительных производств ФССП",
  "КАД Арбитр",
  "ГАС «Правосудие»",
  "ФНС: ЕГРЮЛ/ЕГРИП",
  "Госуслуги Бизнес",
  "Гарант Мониторинг"
];

export default function FinesMonitoringPage() {
  const totals = useMemo(
    () => monthly.reduce((acc, row) => ({ fines: acc.fines + row.fines, claims: acc.claims + row.claims, total: acc.total + row.total }), { fines: 0, claims: 0, total: 0 }),
    []
  );

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Мониторинг штрафов</h2>
            <p className="mt-1 text-sm text-muted">Демо-витрина по штрафам, искам и юридическим рискам для собственника и юр отдела.</p>
          </div>
          <HelpPopover
            title="Как использовать"
            items={[
              "Следите за динамикой штрафов и исков по месяцам.",
              "Смотрите топ рисков и ответственных.",
              "Подключайте внешние сервисы для автоматической проверки."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-muted">Штрафы за 6 месяцев</p>
          <p className="mt-2 text-3xl font-extrabold text-rose-700">{totals.fines}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Иски за 6 месяцев</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-700">{totals.claims}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Сумма рисков</p>
          <p className="mt-2 text-3xl font-extrabold">{totals.total.toLocaleString("ru-RU")} ₽</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Индекс юр-риска</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-700">58/100</p>
          <p className="text-xs text-muted">Зона внимания</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Статистика по месяцам</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="pb-2">Месяц</th>
                <th className="pb-2">Штрафы</th>
                <th className="pb-2">Иски</th>
                <th className="pb-2">Сумма</th>
                <th className="pb-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((row) => (
                <tr key={row.month} className="border-t border-border">
                  <td className="py-2 font-medium">{row.month}</td>
                  <td className="py-2">{row.fines}</td>
                  <td className="py-2">{row.claims}</td>
                  <td className="py-2">{row.total.toLocaleString("ru-RU")} ₽</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${row.total > 150000 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {row.total > 150000 ? "Высокий риск" : "Контролируемо"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Подключение внешних сервисов</h3>
        <p className="mb-3 text-sm text-muted">Витрина интеграций показывает, какие сервисы можно подключить для мониторинга штрафов и исков.</p>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service} className="rounded-xl border border-border bg-white p-3 text-sm">
              <p className="font-semibold">{service}</p>
              <p className="mt-1 text-xs text-muted">Проверка штрафов, исков, статусов и изменений по контрагентам.</p>
              <button className="mt-2 rounded-lg border border-border px-2 py-1 text-xs font-semibold">Подключить</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
