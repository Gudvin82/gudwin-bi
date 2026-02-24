import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAnalyticPlan } from "@/lib/ai/provider";
import { getSessionContext } from "@/lib/auth/session";
import { advisorMessages } from "@/lib/demo-store";
import { checkRateLimit } from "@/lib/security/rate-limit";

const schema = z.object({
  role: z.enum(["business", "accountant", "financier"]),
  message: z.string().min(5),
  sessionId: z.string().optional()
});

const rolePrompts = {
  business: "Ты бизнес-консультант: стратегия, продажи, операционка.",
  accountant: "Ты AI-бухгалтер: учет, налоги, отчетность. Добавляй дисклеймер, что это не юр. консультация.",
  financier: "Ты AI-финансист: cash flow, бюджет, сценарный анализ и риски."
};

const kpiContext = {
  revenue_30d: 3950000,
  expenses_30d: 2510000,
  margin_pct: 36.5,
  receivables: 540000,
  payables: 290000,
  channels: ["online", "marketplace", "retail"]
};

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const rate = checkRateLimit(`${session.workspaceId}:${session.userId}:advisor`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Слишком много запросов к консультанту. Повторите через минуту." }, { status: 429 });
  }

  const plan = await buildAnalyticPlan(
    `${rolePrompts[input.role]}\nВопрос: ${input.message}\nКонтекст KPI: ${JSON.stringify(kpiContext)}`,
    `workspace=${session.workspaceId}; revenue(month,amount); expenses(category,amount); cashflow(date,in,out)`
  );

  const structured = {
    summary:
      input.role === "accountant"
        ? "Основные учетные показатели стабильны. Требуется проверить корректность закрытия периода и контроль налоговых сроков."
        : input.role === "financier"
          ? "По базовому сценарию ликвидность достаточна на 3 месяца, но есть риск кассового разрыва при падении выручки на 20%."
          : "Операционная эффективность улучшается, но канал маркетплейса снижает итоговую маржу.",
    insights: [
      `Выручка за 30 дней: ${kpiContext.revenue_30d.toLocaleString("ru-RU")} ₽, маржа: ${kpiContext.margin_pct}%`,
      `Дебиторка ${kpiContext.receivables.toLocaleString("ru-RU")} ₽ против кредиторки ${kpiContext.payables.toLocaleString("ru-RU")} ₽`
    ],
    recommendations: [
      "Пересмотреть скидки по низкомаржинальным SKU и обновить ценовые пороги.",
      "Запустить недельный контроль cash flow с лимитами расходов по категориям."
    ],
    risk_flags: ["Риск кассового разрыва в конце следующего месяца при росте дебиторки >15%."]
  };

  advisorMessages.push(
    {
      id: crypto.randomUUID(),
      sessionId: input.sessionId ?? "",
      role: "user",
      content: input.message,
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      sessionId: input.sessionId ?? "",
      role: "assistant",
      content: structured.summary,
      structured,
      createdAt: new Date().toISOString()
    }
  );

  return NextResponse.json({
    ...structured,
    sql: plan.sql,
    context: {
      kpi: kpiContext,
      dataSources: ["google_sheets", "bitrix24", "excel_upload"],
      warnings: ["2 источника не синхронизировались более 24 часов"]
    },
    isFallback: plan.isFallback ?? false
  });
}
