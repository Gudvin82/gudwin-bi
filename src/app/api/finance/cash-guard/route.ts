import { NextResponse } from "next/server";
import { buildCashForecast } from "@/lib/demo-os";

export async function GET() {
  const forecast30 = buildCashForecast(30);
  const forecast60 = buildCashForecast(60);
  const forecast90 = buildCashForecast(90);

  const minBalance = Math.min(...forecast90.map((d) => d.balance));
  const breakpoints = forecast90.filter((d) => d.balance < 0).slice(0, 5);

  return NextResponse.json({
    forecast30,
    forecast60: forecast60.slice(-15),
    forecast90: forecast90.slice(-20),
    minBalance,
    breakpoints,
    recommendations: [
      "Ускорить сбор дебиторки по 5 крупнейшим клиентам.",
      "Перенести часть платежей поставщикам на +7 дней.",
      "Ограничить необязательные расходы до стабилизации остатка."
    ]
  });
}
