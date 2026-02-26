"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type DebtItem = {
  id: string;
  title: string;
  lender: string;
  amount: number;
  balance: number;
  rate: number;
  dueDate: string;
  status: "active" | "closed" | "overdue";
  note?: string;
};

const statusLabel: Record<DebtItem["status"], string> = {
  active: "Активен",
  closed: "Закрыт",
  overdue: "Просрочен"
};

export default function FinanceDebtsPage() {
  const [items, setItems] = useState<DebtItem[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "Кредит на оборотку",
    lender: "Банк",
    amount: 500000,
    balance: 350000,
    rate: 17.5,
    dueDate: "2026-08-01",
    status: "active" as DebtItem["status"],
    note: ""
  });

  const load = async () => {
    try {
      const res = await fetch("/api/finance/debts");
      if (!res.ok) {
        setError("Не удалось загрузить список долгов.");
        return;
      }
      const json = await res.json();
      setItems(json.items ?? []);
    } catch {
      setError("Не удалось загрузить список долгов.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    try {
      const res = await fetch("/api/finance/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          balance: Number(form.balance),
          rate: Number(form.rate)
        })
      });
      if (!res.ok) {
        setError("Не удалось добавить долг.");
        return;
      }
      await load();
    } catch {
      setError("Не удалось добавить долг.");
    }
  };

  const updateStatus = async (id: string, status: DebtItem["status"]) => {
    try {
      const res = await fetch("/api/finance/debts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) {
        setError("Не удалось обновить статус долга.");
        return;
      }
      await load();
    } catch {
      setError("Не удалось обновить статус долга.");
    }
  };

  const totalBalance = useMemo(() => items.reduce((acc, row) => acc + row.balance, 0), [items]);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-50 to-rose-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold">Долги и займы</h2>
            <p className="mt-1 text-sm text-muted">Учёт кредитов, рассрочек и займов владельца с остатками и сроками.</p>
            {error ? <p className="mt-2 text-xs font-semibold text-amber-700">{error}</p> : null}
          </div>
          <HelpPopover
            title="Что здесь важно"
            items={[
              "Контролируйте остатки и сроки погашения.",
              "Фиксируйте займы учредителя отдельной строкой.",
              "Отмечайте просрочку для автоматических алертов."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-xs text-muted">Остаток долгов</p><p className="mt-1 text-2xl font-extrabold">{totalBalance.toLocaleString("ru-RU")} ₽</p></Card>
        <Card><p className="text-xs text-muted">Активных договоров</p><p className="mt-1 text-2xl font-extrabold">{items.filter((i) => i.status === "active").length}</p></Card>
        <Card><p className="text-xs text-muted">Просроченные</p><p className="mt-1 text-2xl font-extrabold text-rose-700">{items.filter((i) => i.status === "overdue").length}</p></Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Добавить долг</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-border p-2 text-sm" placeholder="Название" />
          <input value={form.lender} onChange={(e) => setForm({ ...form, lender: e.target.value })} className="rounded-xl border border-border p-2 text-sm" placeholder="Кредитор" />
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Сумма" />
          <input type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Остаток" />
          <input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} className="rounded-xl border border-border p-2 text-sm" placeholder="Ставка %" />
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="rounded-xl border border-border p-2 text-sm" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as DebtItem["status"] })} className="rounded-xl border border-border p-2 text-sm">
            <option value="active">Активен</option>
            <option value="closed">Закрыт</option>
            <option value="overdue">Просрочен</option>
          </select>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="rounded-xl border border-border p-2 text-sm" placeholder="Комментарий" />
        </div>
        <button onClick={create} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Добавить</button>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Список долгов</h3>
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted">{item.lender} • До {item.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.balance.toLocaleString("ru-RU")} ₽</p>
                  <p className="text-xs text-muted">Ставка {item.rate}%</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value as DebtItem["status"])} className="rounded-lg border border-border px-2 py-1 text-xs">
                  <option value="active">Активен</option>
                  <option value="closed">Закрыт</option>
                  <option value="overdue">Просрочен</option>
                </select>
                <span className="text-xs text-muted">{statusLabel[item.status]}</span>
              </div>
              {item.note ? <p className="mt-2 text-xs text-muted">{item.note}</p> : null}
            </div>
          ))}
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-3 text-sm text-muted">Долгов пока нет.</div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
