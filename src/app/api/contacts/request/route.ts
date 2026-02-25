import { NextResponse } from "next/server";
import { z } from "zod";
import { devRequests } from "@/lib/demo-os";

const schema = z.object({
  name: z.string().min(2),
  contact: z.string().min(5),
  message: z.string().min(10)
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input };
  devRequests.unshift(record);
  return NextResponse.json({ ok: true, request: record, _meta: { mode: "prod", generatedAt: new Date().toISOString() } });
}
