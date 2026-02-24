import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { HttpSmsProvider } from "@/lib/notifications/sms";

const schema = z.object({
  to: z.string().min(5),
  message: z.string().min(2)
});

export async function POST(request: Request) {
  const session = await getSessionContext();
  if (session.role !== "owner") {
    return NextResponse.json({ error: "Only owner can send test SMS" }, { status: 403 });
  }

  const input = schema.parse(await request.json());
  const provider = new HttpSmsProvider();
  const result = await provider.send(input);

  return NextResponse.json({ ok: result.ok, providerMessageId: result.providerMessageId ?? null });
}
