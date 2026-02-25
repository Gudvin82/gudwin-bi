import { paymentCalendar } from "@/lib/demo-os";

export type LedgerTx = {
  id: string;
  workspaceId: string;
  date: string;
  direction: "income" | "expense";
  account: string;
  category: string;
  counterparty: string;
  amount: number;
  note?: string;
  source: "manual" | "import";
  createdAt: string;
};

export type ManualPayment = {
  id: string;
  workspaceId: string;
  date: string;
  type: "incoming" | "outgoing";
  counterparty: string;
  amount: number;
  status: "planned" | "paid" | "overdue";
  note?: string;
};

export const ledgerTransactions: LedgerTx[] = [];

export const manualPayments: ManualPayment[] = paymentCalendar.map((item, idx) => ({
  id: `pay_${idx + 1}`,
  workspaceId: "default",
  date: item.date,
  type: item.type,
  counterparty: item.counterparty,
  amount: item.amount,
  status: item.status,
  note: "Автосоздано из календаря платежей"
}));

const monthKey = (date: string) => date.slice(0, 7);

export function getMonthlyDds(transactions: LedgerTx[]) {
  const bucket = new Map<string, { inflow: number; outflow: number }>();
  for (const tx of transactions) {
    const key = monthKey(tx.date);
    const item = bucket.get(key) ?? { inflow: 0, outflow: 0 };
    if (tx.direction === "income") item.inflow += tx.amount;
    else item.outflow += tx.amount;
    bucket.set(key, item);
  }

  return Array.from(bucket.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month,
      inflow: values.inflow,
      outflow: values.outflow,
      net: values.inflow - values.outflow
    }));
}

export function getPnlByCategory(transactions: LedgerTx[]) {
  const expenses = new Map<string, number>();
  let revenue = 0;

  for (const tx of transactions) {
    if (tx.direction === "income") {
      revenue += tx.amount;
      continue;
    }
    expenses.set(tx.category, (expenses.get(tx.category) ?? 0) + tx.amount);
  }

  const opex = Array.from(expenses.entries()).map(([category, amount]) => ({ category, amount }));
  const totalExpense = opex.reduce((acc, row) => acc + row.amount, 0);
  return {
    revenue,
    opex,
    totalExpense,
    grossProfit: revenue - totalExpense
  };
}

export function getBalanceSummary(transactions: LedgerTx[], payments: ManualPayment[]) {
  const cashIn = transactions.filter((tx) => tx.direction === "income").reduce((acc, tx) => acc + tx.amount, 0);
  const cashOut = transactions.filter((tx) => tx.direction === "expense").reduce((acc, tx) => acc + tx.amount, 0);
  const plannedOut = payments.filter((p) => p.type === "outgoing" && p.status === "planned").reduce((acc, p) => acc + p.amount, 0);
  const plannedIn = payments.filter((p) => p.type === "incoming" && p.status === "planned").reduce((acc, p) => acc + p.amount, 0);
  const currentCash = cashIn - cashOut;

  return {
    currentCash,
    plannedIn,
    plannedOut,
    projectedCash: currentCash + plannedIn - plannedOut
  };
}
