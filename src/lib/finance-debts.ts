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

export const debts: DebtItem[] = [];
