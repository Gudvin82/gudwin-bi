import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { reportTemplates } from "@/lib/report-templates";

const schema = z.object({
  name: z.string().min(3),
  prompt: z.string().min(5),
  datasetIds: z.array(z.string()).default(["all"]),
  channels: z.array(z.string()).default(["telegram"]),
  recipients: z.array(z.string()).default([]),
  schedule: z
    .object({
      frequency: z.enum(["daily", "weekly", "monthly"]),
      time: z.string().min(4),
      dayOfWeek: z.string().optional(),
      dayOfMonth: z.number().min(1).max(28).optional()
    })
    .optional()
});

export async function GET() {
  const session = await getSessionContext();
  const items = reportTemplates.filter((item) => item.workspaceId === session.workspaceId);
  return NextResponse.json({ templates: items });
}

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  const template = {
    id: crypto.randomUUID(),
    workspaceId: session.workspaceId,
    ...input,
    createdAt: new Date().toISOString()
  };
  reportTemplates.unshift(template);
  return NextResponse.json({
    ok: true,
    template
  });
}
