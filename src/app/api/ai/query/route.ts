import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { buildAnalyticPlan } from "@/lib/ai/provider";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { enforceSqlSafety } from "@/lib/ai/sql-safety";

const schema = z.object({
  question: z.string().min(5),
  datasetIds: z.array(z.string()).default(["all"])
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const session = await getSessionContext();
  const rate = checkRateLimit(`${session.workspaceId}:${session.userId}`, 25, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Слишком много AI-запросов. Повторите через минуту." }, { status: 429 });
  }

  const plan = await buildAnalyticPlan(
    input.question,
    `workspace=${session.workspaceId}; datasets=${input.datasetIds.join(",")}; sales(date, revenue, check, channel)`
  );
  const sqlSafety = enforceSqlSafety(plan.sql);
  if (!sqlSafety.safe) {
    return NextResponse.json(
      { error: sqlSafety.reason, safe_sql: "SELECT month, sum(revenue) as revenue FROM sales GROUP BY month LIMIT 1000;" },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ...plan,
    sql: sqlSafety.sql,
    safety_note: sqlSafety.warning,
    previewRows: [
      { month: "2026-01", revenue: 1200000, avg_check: 3100 },
      { month: "2026-02", revenue: 1370000, avg_check: 3290 }
    ],
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
