export type DebtItem = {
  id: string;
  workspaceId: string;
  title: string;
  lender: string;
  amount: number;
  balance: number;
  rate: number;
  dueDate: string;
  status: "active" | "closed" | "overdue";
  note?: string;
  createdAt: string;
};

const now = new Date().toISOString();

export const debts: DebtItem[] = [
  {
    id: "debt_1",
    workspaceId: "demo",
    title: "Овердрафт на оборотку",
    lender: "Банк Альфа",
    amount: 1500000,
    balance: 820000,
    rate: 17.5,
    dueDate: "2026-07-15",
    status: "active",
    note: "Ежемесячное погашение 120 000 ₽",
    createdAt: now
  },
  {
    id: "debt_2",
    workspaceId: "demo",
    title: "Займ собственника",
    lender: "Учредитель",
    amount: 600000,
    balance: 300000,
    rate: 0,
    dueDate: "2026-05-01",
    status: "active",
    note: "Без процентов, возврат по итогам квартала",
    createdAt: now
  }
];
