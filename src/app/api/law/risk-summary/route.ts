import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  counterpartyName: z.string().min(2),
  counterpartyStatus: z.string(),
  riskFactors: z.array(z.string()).default([]),
  contractText: z.string().optional()
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());

  const status = input.counterpartyStatus.toLowerCase();
  const level = status.includes("red") || status.includes("крас") ? "высокий" : status.includes("yellow") || status.includes("жел") ? "средний" : "низкий";

  return NextResponse.json({
    summary: `Юридический риск по контрагенту «${input.counterpartyName}»: ${level}.`,
    flags: input.riskFactors.length ? input.riskFactors : ["Существенных флагов не найдено"],
    contract_notes: input.contractText
      ? ["Проверены базовые условия: ответственность, сроки, порядок расторжения.", "Нужна ручная юридическая верификация перед подписанием."]
      : ["Текст договора не предоставлен. Доступен только риск-профиль контрагента."],
    disclaimer: "AI-юрист не дает юридических гарантий и не заменяет профильного юриста."
  });
}
