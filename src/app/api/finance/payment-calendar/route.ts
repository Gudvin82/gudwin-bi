import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { manualPayments } from "@/lib/finance-ledger";

const createSchema = z.object({
  date: z.string().min(8),
  type: z.enum(["incoming", "outgoing"]),
  counterparty: z.string().min(2),
  amount: z.number().positive(),
  status: z.enum(["planned", "paid", "overdue"]).default("planned"),
  note: z.string().optional()
});

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["planned", "paid", "overdue"])
});

export async function GET() {
  const session = await getSessionContext();
  const items = manualPayments.filter((item) => item.workspaceId === session.workspaceId || item.workspaceId === "demo");
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());
  const item = {
    id: `pay_${Date.now()}`,
    workspaceId: session.workspaceId,
    ...input
  };
  manualPayments.unshift(item);
  return NextResponse.json({ item });
}

export async function PATCH(request: Request) {
  const input = updateSchema.parse(await request.json());
  const item = manualPayments.find((row) => row.id === input.id);
  if (!item) {
    return NextResponse.json({ error: "Платеж не найден" }, { status: 404 });
  }
  item.status = input.status;
  return NextResponse.json({ item });
}
