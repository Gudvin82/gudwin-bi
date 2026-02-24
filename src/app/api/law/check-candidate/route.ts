import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(5),
  passport: z.string().min(6),
  inn: z.string().optional(),
  consent: z.boolean()
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());

  if (!input.consent) {
    return NextResponse.json({ error: "Проверка кандидата возможна только при наличии согласия (152-ФЗ)." }, { status: 400 });
  }

  const invalidPassport = input.passport.endsWith("00");
  const risk = invalidPassport ? "Есть риски" : "ОК";

  return NextResponse.json({
    status: risk,
    checks: {
      passport_validity: invalidPassport ? "Недействителен (демо-проверка)" : "Действителен (демо-проверка)",
      inn_status: input.inn ? "ИНН найден, признаков недействительности не обнаружено" : "ИНН не указан",
      self_employed_or_ip: "Требуется дополнительная проверка по внешнему сервису"
    },
    summary: invalidPassport
      ? "Обнаружен повышенный риск по документам кандидата. Рекомендуется ручная проверка и подтверждающие документы."
      : "Критичных рисков не обнаружено. Можно переходить к следующему этапу отбора."
  });
}
