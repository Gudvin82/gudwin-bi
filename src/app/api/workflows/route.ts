import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { workflowLogs, workflows } from "@/lib/demo-store";
import { integrations } from "@/lib/demo-os";

const createSchema = z.object({
  name: z.string().min(3),
  triggerType: z.enum(["schedule", "metric_threshold", "event"]),
  metric: z.string().optional(),
  operator: z.enum([">", "<", "="]).optional(),
  value: z.number().optional(),
  schedule: z.enum(["daily", "weekly", "monthly"]).optional(),
  event: z.string().optional(),
  actionType: z.enum(["notify", "create_task", "run_agent", "integration"]),
  actionDescription: z.string().min(3)
});

export async function GET() {
  const session = await getSessionContext();
  const items = workflows.filter((item) => item.workspaceId === session.workspaceId);

  return NextResponse.json({
    workflows: items,
    logs: workflowLogs.filter((item) => items.some((workflow) => workflow.id === item.workflowId)),
    integrations: integrations.map((item) => ({
      id: item.id,
      type: item.type,
      status: item.status
    })),
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = createSchema.parse(await request.json());

  const workflow = {
    id: `wf_${Date.now()}`,
    workspaceId: session.workspaceId,
    name: input.name,
    status: "active" as const,
    definition: {
      trigger: {
        type: input.triggerType,
        metric: input.metric,
        operator: input.operator,
        value: input.value,
        schedule: input.schedule,
        event: input.event
      },
      conditions: [],
      actions: [
        {
          type: input.actionType,
          description: input.actionDescription
        }
      ]
    },
    lastRunAt: new Date().toISOString()
  };

  workflows.unshift(workflow);
  return NextResponse.json({ workflow, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}
