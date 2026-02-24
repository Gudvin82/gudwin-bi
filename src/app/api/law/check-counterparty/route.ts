import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  inn: z.string().min(10).max(12)
});

export async function POST(request: Request) {
  const { inn } = schema.parse(await request.json());

  const risk = inn.endsWith("7") ? "red" : inn.endsWith("3") ? "yellow" : "green";
  const comment = risk === "green" ? "Критичных рисков не найдено." : risk === "yellow" ? "Нужна доп.проверка отчетности и бенефициаров." : "Высокий риск: рекомендуется расширенная проверка.";

  return NextResponse.json({
    inn,
    source: "API-ФНС (демо-интеграция)",
    status: risk,
    comment,
    profile: {
      company_status: risk === "red" ? "Есть признаки высокого риска" : "Действующая компания",
      risk_factors: risk === "red" ? ["массовый директор", "признаки недостоверных сведений"] : risk === "yellow" ? ["требуется доп.проверка отчетности"] : ["критичные риски не выявлены"],
      monitor_available: true
    }
  });
}
