import { NextResponse } from "next/server";
import { z } from "zod";
import { simulateScenario } from "@/lib/demo-os";

const schema = z.object({
  priceDeltaPct: z.number().min(-50).max(50),
  adBudgetDeltaPct: z.number().min(-80).max(200),
  managerDelta: z.number().int().min(-20).max(50),
  discountDeltaPct: z.number().min(-50).max(50)
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  return NextResponse.json({ scenario: simulateScenario(input), _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
