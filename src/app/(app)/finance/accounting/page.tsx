"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type Tx = {
  id: string;
  date: string;
  direction: "income" | "expense";
  account: string;
  category: string;
  counterparty: string;
  amount: number;
  note?: string;
  source: "manual" | "import";
};

type Payment = {
  id: string;
  date: string;
  type: "incoming" | "outgoing";
  counterparty: string;
  amount: number;
  status: "planned" | "paid" | "overdue";
  note?: string;
};

type Reports = {
  dds: Array<{ month: string; inflow: number; outflow: number; net: number }>;
  pnl: { revenue: number; opex: Array<{ category: string; amount: number }>; totalExpense: number; grossProfit: number };
  balance: { currentCash: number; plannedIn: number; plannedOut: number; projectedCash: number };
};

const paymentStatusLabel: Record<Payment["status"], string> = {
  planned: "Запланирован",
  paid: "Оплачен",
  overdue: "Просрочен"
};

const txDefaults: {
  date: string;
  direction: "income" | "expense";
  account: string;
  category: string;
  counterparty: string;
  amount: number;
  note: string;
} = {
  date: "2026-02-25",
  direction: "expense",
  account: "Расчетный счет",
  category: "Операционные",
  counterparty: "Поставщик",
  amount: 10000,
  note: ""
};

const paymentDefaults: {
  date: string;
  type: "incoming" | "outgoing";
  counterparty: string;
  amount: number;
  status: "planned" | "paid" | "overdue";
  note: string;
} = {
  date: "2026-02-27",
  type: "outgoing",
  counterparty: "Контрагент",
  amount: 15000,
  status: "planned",
  note: ""
};

type ImportMap = {
  date: string;
  direction: string;
  account: string;
  category: string;
  counterparty: string;
  amount: string;
  note: string;
};

export default function FinanceAccountingPage() {
  const [tx, setTx] = useState(txDefaults);
  const [pay, setPay] = useState(paymentDefaults);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const [importCols, setImportCols] = useState<string[]>([]);
  const [importRows, setImportRows] = useState<string[][]>([]);
  const [importMap, setImportMap] = useState<ImportMap>({
    date: "",
    direction: "",
    account: "",
    category: "",
    counterparty: "",
    amount: "",
    note: ""
  });

  const load = async () => {
    const [txRes, payRes, repRes] = await Promise.all([
      fetch("/api/finance/transactions").then((r) => r.json()),
      fetch("/api/finance/payment-calendar").then((r) => r.json()),
      fetch("/api/finance/reports").then((r) => r.json())
    ]);
    setTransactions(txRes.items ?? []);
    setPayments(payRes.items ?? []);
    setReports(repRes ?? null);
  };

  useEffect(() => {
    void load();
  }, []);

  const submitTransaction = async () => {
    setLoading(true);
    setNotice("");
    try {
      const res = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tx, amount: Number(tx.amount), source: "manual" })
      });
      if (!res.ok) {
        setNotice("Не удалось сохранить транзакцию.");
        return;
      }
      setNotice("Транзакция добавлена.");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const submitPayment = async () => {
    setLoading(true);
    setNotice("");
    try {
      const res = await fetch("/api/finance/payment-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pay, amount: Number(pay.amount) })
      });
      if (!res.ok) {
        setNotice("Не удалось добавить платеж.");
        return;
      }
      setNotice("Платеж в календарь добавлен.");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: string, status: Payment["status"]) => {
    await fetch("/api/finance/payment-calendar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    await load();
  };

  const onImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return;
    const cols = lines[0].split(/[;,]/).map((item) => item.trim());
    const rows = lines.slice(1).map((line) => line.split(/[;,]/).map((item) => item.trim()));
    setImportCols(cols);
    setImportRows(rows.slice(0, 200));
    setImportMap({
      date: cols.find((c) => /date|дата/i.test(c)) ?? "",
      direction: cols.find((c) => /type|тип|direction|приход|расход/i.test(c)) ?? "",
      account: cols.find((c) => /account|счет|касса/i.test(c)) ?? "",
      category: cols.find((c) => /category|катег/i.test(c)) ?? "",
      counterparty: cols.find((c) => /counterparty|контрагент|поставщик|клиент/i.test(c)) ?? "",
      amount: cols.find((c) => /amount|sum|сумма/i.test(c)) ?? "",
      note: cols.find((c) => /note|коммент/i.test(c)) ?? ""
    });
  };

  const importPreviewCount = useMemo(() => importRows.length, [importRows.length]);

  const importMappedRows = async () => {
    if (!importCols.length || !importRows.length) {
      setNotice("Сначала загрузите файл.");
      return;
    }
    const idx = (col: string) => importCols.indexOf(col);
    const dateIdx = idx(importMap.date);
    const directionIdx = idx(importMap.direction);
    const accountIdx = idx(importMap.account);
    const categoryIdx = idx(importMap.category);
    const counterpartyIdx = idx(importMap.counterparty);
    const amountIdx = idx(importMap.amount);
    const noteIdx = idx(importMap.note);

    const mapped = importRows
      .map((row) => {
        const rawDirection = (row[directionIdx] ?? "").toLowerCase();
        const direction: "income" | "expense" = /(income|приход|in)/.test(rawDirection) ? "income" : "expense";
        const amount = Number((row[amountIdx] ?? "0").replace(/\s/g, "").replace(",", "."));
        return {
          date: row[dateIdx] ?? "2026-02-25",
          direction,
          account: row[accountIdx] ?? "Расчетный счет",
          category: row[categoryIdx] ?? "Без категории",
          counterparty: row[counterpartyIdx] ?? "Не указан",
          amount: Number.isFinite(amount) ? Math.abs(amount) : 0,
          note: noteIdx >= 0 ? row[noteIdx] : "",
          source: "import" as const
        };
      })
      .filter((item) => item.amount > 0);

    if (!mapped.length) {
      setNotice("После маппинга не найдено валидных строк для импорта.");
      return;
    }

    setLoading(true);
    let imported = 0;
    try {
      for (const row of mapped.slice(0, 100)) {
        const res = await fetch("/api/finance/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row)
        });
        if (res.ok) imported += 1;
      }
      setNotice(`Импорт завершен: ${imported} строк.`);
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-emerald-50 to-cyan-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Финучет и отчетность</h2>
            <p className="mt-1 text-sm text-muted">Ручной ввод транзакций, платежный календарь и стандартные отчеты: ДДС, P&L, баланс.</p>
          </div>
          <HelpPopover
            title="Что можно сделать"
            items={[
              "Добавляйте доходы и расходы вручную с категоризацией.",
              "Ведите план/факт платежей без интеграций.",
              "Получайте отчеты в формате, привычном финансистам."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Ручной ввод транзакций</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="date" value={tx.date} onChange={(e) => setTx({ ...tx, date: e.target.value })} className="rounded-xl border border-border p-2 text-sm" />
            <select value={tx.direction} onChange={(e) => setTx({ ...tx, direction: e.target.value as "income" | "expense" })} className="rounded-xl border border-border p-2 text-sm">
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
            <input value={tx.account} onChange={(e) => setTx({ ...tx, account: e.target.value })} placeholder="Счет / касса" className="rounded-xl border border-border p-2 text-sm" />
            <input value={tx.category} onChange={(e) => setTx({ ...tx, category: e.target.value })} placeholder="Категория" className="rounded-xl border border-border p-2 text-sm" />
            <input value={tx.counterparty} onChange={(e) => setTx({ ...tx, counterparty: e.target.value })} placeholder="Контрагент" className="rounded-xl border border-border p-2 text-sm sm:col-span-2" />
            <input type="number" value={tx.amount} onChange={(e) => setTx({ ...tx, amount: Number(e.target.value) })} placeholder="Сумма" className="rounded-xl border border-border p-2 text-sm" />
            <input value={tx.note} onChange={(e) => setTx({ ...tx, note: e.target.value })} placeholder="Комментарий" className="rounded-xl border border-border p-2 text-sm" />
          </div>
          <button onClick={submitTransaction} disabled={loading} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            {loading ? "Сохраняем..." : "Добавить транзакцию"}
          </button>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Платежный календарь (ручной)</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="date" value={pay.date} onChange={(e) => setPay({ ...pay, date: e.target.value })} className="rounded-xl border border-border p-2 text-sm" />
            <select value={pay.type} onChange={(e) => setPay({ ...pay, type: e.target.value as "incoming" | "outgoing" })} className="rounded-xl border border-border p-2 text-sm">
              <option value="incoming">Поступление</option>
              <option value="outgoing">Платеж</option>
            </select>
            <input value={pay.counterparty} onChange={(e) => setPay({ ...pay, counterparty: e.target.value })} placeholder="Контрагент" className="rounded-xl border border-border p-2 text-sm sm:col-span-2" />
            <input type="number" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: Number(e.target.value) })} placeholder="Сумма" className="rounded-xl border border-border p-2 text-sm" />
            <select value={pay.status} onChange={(e) => setPay({ ...pay, status: e.target.value as "planned" | "paid" | "overdue" })} className="rounded-xl border border-border p-2 text-sm">
              <option value="planned">Запланирован</option>
              <option value="paid">Оплачен</option>
              <option value="overdue">Просрочен</option>
            </select>
          </div>
          <button onClick={submitPayment} disabled={loading} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            {loading ? "Сохраняем..." : "Добавить платеж"}
          </button>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Импорт истории из Excel/CSV с маппингом</h3>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <input type="file" accept=".csv,.xlsx,.xls" onChange={onImportFile} className="rounded-xl border border-border p-2 text-sm md:col-span-2" />
          <select value={importMap.date} onChange={(e) => setImportMap({ ...importMap, date: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
            <option value="">Колонка даты</option>
            {importCols.map((col) => <option key={`date_${col}`} value={col}>{col}</option>)}
          </select>
          <select value={importMap.direction} onChange={(e) => setImportMap({ ...importMap, direction: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
            <option value="">Колонка типа</option>
            {importCols.map((col) => <option key={`dir_${col}`} value={col}>{col}</option>)}
          </select>
          <select value={importMap.account} onChange={(e) => setImportMap({ ...importMap, account: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
            <option value="">Колонка счета</option>
            {importCols.map((col) => <option key={`acc_${col}`} value={col}>{col}</option>)}
          </select>
          <select value={importMap.category} onChange={(e) => setImportMap({ ...importMap, category: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
            <option value="">Колонка категории</option>
            {importCols.map((col) => <option key={`cat_${col}`} value={col}>{col}</option>)}
          </select>
          <select value={importMap.counterparty} onChange={(e) => setImportMap({ ...importMap, counterparty: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
            <option value="">Колонка контрагента</option>
            {importCols.map((col) => <option key={`cp_${col}`} value={col}>{col}</option>)}
          </select>
          <select value={importMap.amount} onChange={(e) => setImportMap({ ...importMap, amount: e.target.value })} className="rounded-xl border border-border p-2 text-sm">
            <option value="">Колонка суммы</option>
            {importCols.map((col) => <option key={`amount_${col}`} value={col}>{col}</option>)}
          </select>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button onClick={importMappedRows} disabled={loading} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold">
            Импортировать с маппингом
          </button>
          <span className="text-xs text-muted">Строк в превью: {importPreviewCount}</span>
        </div>
      </Card>

      {reports ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Card><p className="text-xs text-muted">Текущий cash</p><p className="mt-1 text-2xl font-extrabold">{reports.balance.currentCash.toLocaleString("ru-RU")} ₽</p></Card>
          <Card><p className="text-xs text-muted">План поступлений</p><p className="mt-1 text-2xl font-extrabold">{reports.balance.plannedIn.toLocaleString("ru-RU")} ₽</p></Card>
          <Card><p className="text-xs text-muted">План платежей</p><p className="mt-1 text-2xl font-extrabold">{reports.balance.plannedOut.toLocaleString("ru-RU")} ₽</p></Card>
          <Card><p className="text-xs text-muted">Прогноз cash</p><p className="mt-1 text-2xl font-extrabold">{reports.balance.projectedCash.toLocaleString("ru-RU")} ₽</p></Card>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Отчет ДДС (месяц)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted">
                <tr><th className="pb-2">Месяц</th><th className="pb-2">Поступления</th><th className="pb-2">Платежи</th><th className="pb-2">Чистый поток</th></tr>
              </thead>
              <tbody>
                {(reports?.dds ?? []).map((row) => (
                  <tr key={row.month} className="border-t border-border">
                    <td className="py-2">{row.month}</td>
                    <td className="py-2">{row.inflow.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-2">{row.outflow.toLocaleString("ru-RU")} ₽</td>
                    <td className={`py-2 font-semibold ${row.net < 0 ? "text-red-700" : "text-emerald-700"}`}>{row.net.toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Отчет P&L (период)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2"><span>Выручка</span><span className="font-semibold">{(reports?.pnl.revenue ?? 0).toLocaleString("ru-RU")} ₽</span></div>
            {(reports?.pnl.opex ?? []).map((row) => (
              <div key={row.category} className="flex items-center justify-between rounded-lg border border-border px-3 py-2"><span>{row.category}</span><span>{row.amount.toLocaleString("ru-RU")} ₽</span></div>
            ))}
            <div className="flex items-center justify-between rounded-lg border border-border bg-slate-50 px-3 py-2"><span>Итого расходы</span><span className="font-semibold">{(reports?.pnl.totalExpense ?? 0).toLocaleString("ru-RU")} ₽</span></div>
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"><span>Валовая прибыль</span><span className="font-semibold">{(reports?.pnl.grossProfit ?? 0).toLocaleString("ru-RU")} ₽</span></div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Журнал транзакций и платежей</h3>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="overflow-x-auto">
            <p className="mb-2 text-sm font-semibold">Транзакции</p>
            <table className="min-w-[680px] w-full text-sm">
              <thead className="text-left text-muted">
                <tr><th className="pb-2">Дата</th><th className="pb-2">Тип</th><th className="pb-2">Категория</th><th className="pb-2">Контрагент</th><th className="pb-2">Сумма</th></tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.direction === "income" ? "Доход" : "Расход"}</td>
                    <td className="py-2">{row.category}</td>
                    <td className="py-2">{row.counterparty}</td>
                    <td className={`py-2 ${row.direction === "income" ? "text-emerald-700" : "text-red-700"}`}>{row.amount.toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <p className="mb-2 text-sm font-semibold">Платежный календарь</p>
            <table className="min-w-[640px] w-full text-sm">
              <thead className="text-left text-muted">
                <tr><th className="pb-2">Дата</th><th className="pb-2">Тип</th><th className="pb-2">Контрагент</th><th className="pb-2">Сумма</th><th className="pb-2">Статус</th></tr>
              </thead>
              <tbody>
                {payments.slice(0, 20).map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.type === "incoming" ? "Поступление" : "Платеж"}</td>
                    <td className="py-2">{row.counterparty}</td>
                    <td className="py-2">{row.amount.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-2">
                      <select value={row.status} onChange={(e) => updatePaymentStatus(row.id, e.target.value as Payment["status"])} className="rounded-lg border border-border px-2 py-1 text-xs">
                        <option value="planned">Запланирован</option>
                        <option value="paid">Оплачен</option>
                        <option value="overdue">Просрочен</option>
                      </select>
                      <span className="ml-2 text-xs text-muted">{paymentStatusLabel[row.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {notice ? <p className="text-sm text-muted">{notice}</p> : null}
    </div>
  );
}
