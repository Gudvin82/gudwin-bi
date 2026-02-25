import { NextResponse } from "next/server";
import { buildRevenueForecast } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({
    model: "simple_trend_v1",
    forecast: buildRevenueForecast(6),
    notes: ["Базовый прогноз на текущих данных", "Для прод-режима подключите Prophet/ARIMA и кэш в БД"],
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
