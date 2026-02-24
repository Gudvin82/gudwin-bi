import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { buildAnalyticPlan } from "@/lib/ai/provider";

const schema = z.object({
  question: z.string().min(5),
  datasetIds: z.array(z.string()).default(["all"])
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const session = await getSessionContext();

  const plan = await buildAnalyticPlan(
    input.question,
    `workspace=${session.workspaceId}; datasets=${input.datasetIds.join(",")}; sales(date, revenue, check, channel)`
  );

  return NextResponse.json({
    ...plan,
    previewRows: [
      { month: "2026-01", revenue: 1200000, avg_check: 3100 },
      { month: "2026-02", revenue: 1370000, avg_check: 3290 }
    ]
  });
}
