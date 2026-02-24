import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    extracted: {
      counterparty: "ООО Партнер",
      amount: 128000,
      date: "2026-02-20",
      documentNo: "A-2241",
      vat: "20%"
    },
    matchStatus: "partial_match",
    notes: ["Сумма совпадает", "Контрагент найден", "Номер документа отличается на 1 символ"]
  });
}
