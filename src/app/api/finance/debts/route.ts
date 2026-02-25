import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { debts } from "@/lib/finance-debts";

const createSchema = z.object({
  title: z.string().min(3),
  lender: z.string().min(2),
  amount: z.number().positive(),
  balance: z.number().nonnegative(),
  rate: z.number().min(0),
  dueDate: z.string().min(8),
  status: z.enum(["active", "closed", "overdue"]).default("active"),
  note: z.string().optional()
});

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "closed", "overdue"])
});

export async function GET() {
  const session = await getSessionContext();
  const items = debts.filter((item) => item.workspaceId === session.workspaceId);
  return NextResponse.json({ items, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());
  const item = {
    id: `debt_${Date.now()}`,
    workspaceId: session.workspaceId,
    createdAt: new Date().toISOString(),
    ...input
  };
  debts.unshift(item);
  return NextResponse.json({ item, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}

export async function PATCH(request: Request) {
  const input = updateSchema.parse(await request.json());
  const item = debts.find((row) => row.id === input.id);
  if (!item) {
    return NextResponse.json({ error: "Долг не найден" }, { status: 404 });
  }
  item.status = input.status;
  return NextResponse.json({ item, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}
