import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { ledgerTransactions } from "@/lib/finance-ledger";

const createSchema = z.object({
  date: z.string().min(8),
  direction: z.enum(["income", "expense"]),
  account: z.string().min(2),
  category: z.string().min(2),
  counterparty: z.string().min(2),
  amount: z.number().positive(),
  note: z.string().optional(),
  source: z.enum(["manual", "import"]).default("manual")
});

export async function GET(request: Request) {
  const session = await getSessionContext();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 100);
  const workspaceRows = ledgerTransactions.filter((row) => row.workspaceId === session.workspaceId || row.workspaceId === "demo");
  const rows = workspaceRows
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, Math.max(1, Math.min(limit, 500)));
  return NextResponse.json({ items: rows, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());
  const tx = {
    id: `tx_${Date.now()}`,
    workspaceId: session.workspaceId,
    createdAt: new Date().toISOString(),
    ...input
  };
  ledgerTransactions.unshift(tx);
  return NextResponse.json({ item: tx, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
