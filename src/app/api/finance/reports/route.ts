import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";
import { getBalanceSummary, getMonthlyDds, getPnlByCategory, ledgerTransactions, manualPayments } from "@/lib/finance-ledger";

export async function GET() {
  const session = await getSessionContext();
  const tx = ledgerTransactions.filter((item) => item.workspaceId === session.workspaceId);
  const payments = manualPayments.filter((item) => item.workspaceId === session.workspaceId);

  const dds = getMonthlyDds(tx);
  const pnl = getPnlByCategory(tx);
  const balance = getBalanceSummary(tx, payments);

  return NextResponse.json({
    dds,
    pnl,
    balance,
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}
