import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";

const schema = z.object({
  name: z.string().min(3),
  prompt: z.string().min(5),
  datasetIds: z.array(z.string()).default(["all"]),
  channels: z.array(z.string()).default(["telegram"])
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  const input = schema.parse(await request.json());

  return NextResponse.json({
    ok: true,
    template: {
      id: crypto.randomUUID(),
      workspaceId: session.workspaceId,
      ...input,
      createdAt: new Date().toISOString()
    }
  });
}
