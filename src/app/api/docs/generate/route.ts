import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  template: z.enum(["contract", "invoice", "act", "proposal"]),
  client: z.string().min(2),
  amount: z.number().nonnegative().optional()
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());

  return NextResponse.json({
    docId: crypto.randomUUID(),
    title: `${input.template.toUpperCase()} - ${input.client}`,
    preview: `Документ ${input.template} для ${input.client}. Сумма: ${input.amount ?? "по договору"}.`,
    status: "generated"
  });
}
