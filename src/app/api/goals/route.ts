import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { goals } from "@/lib/demo-store";

const createSchema = z.object({
  title: z.string().min(4),
  targetMetric: z.string().min(2),
  targetValue: z.number(),
  currentValue: z.number().default(0),
  unit: z.enum(["%", "₽", "шт", "дн"]).default("%"),
  deadline: z.string().min(8)
});

const updateTaskSchema = z.object({
  goalId: z.string(),
  taskId: z.string(),
  status: z.enum(["todo", "in_progress", "done"])
});

export async function GET() {
  const session = await getSessionContext();
  return NextResponse.json({
    goals: goals.filter((item) => item.workspaceId === session.workspaceId),
    _meta: { mode: "demo", generatedAt: new Date().toISOString() }
  });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());

  const missingData = ["Банковская выписка", "Актуальные сделки CRM"];
  const hasEnoughData = input.targetMetric.toLowerCase().includes("romi");

  const goal = {
    id: `goal_${Date.now()}`,
    workspaceId: session.workspaceId,
    title: input.title,
    targetMetric: input.targetMetric,
    targetValue: input.targetValue,
    currentValue: input.currentValue,
    unit: input.unit,
    deadline: input.deadline,
    priority: "medium" as const,
    status: "active" as const,
    requiredData: ["Продажи", "Расходы", "Каналы"],
    missingData: hasEnoughData ? [] : missingData,
    aiSummary: hasEnoughData
      ? "Данных достаточно для расчета плана достижения цели."
      : "Не хватает части данных. После подключения источников план станет точнее.",
    aiPlan: hasEnoughData
      ? [
          "Зафиксировать базовый уровень метрики.",
          "Определить 2-3 ключевых действия на ближайшие 14 дней.",
          "Запускать еженедельную сверку факта и плана."
        ]
      : [
          "Подключить недостающие источники данных.",
          "Обновить цель после полной синхронизации.",
          "Перезапустить AI-планирование."
        ],
    tasks: [
      { id: `task_${Date.now()}`, title: "Собрать данные для цели", integration: "internal" as const, status: "todo" as const }
    ],
    updatedAt: new Date().toISOString()
  };

  goals.unshift(goal);
  return NextResponse.json({ goal, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}

export async function PATCH(request: Request) {
  const input = updateTaskSchema.parse(await request.json());
  const goal = goals.find((item) => item.id === input.goalId);
  if (!goal) {
    return NextResponse.json({ error: "Цель не найдена" }, { status: 404 });
  }

  const task = goal.tasks.find((item) => item.id === input.taskId);
  if (!task) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  task.status = input.status;
  goal.updatedAt = new Date().toISOString();

  return NextResponse.json({ goal, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
