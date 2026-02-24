import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "roadmap_v2",
    legal: [
      "Только служебные устройства работодателя",
      "Обязательное уведомление и согласие сотрудника",
      "Соблюдение 152-ФЗ и локальных актов"
    ],
    telemetry: ["используемые приложения", "время активности", "тайм-слоты фокуса"],
    excluded_by_default: ["содержимое переписки", "скриншоты экрана", "клавиатурный ввод"],
    integration: {
      sinks: ["Smart HR", "Smart Watch"],
      alerts: ["резкий спад активности", "ночная нагрузка", "риск выгорания"]
    }
  });
}
