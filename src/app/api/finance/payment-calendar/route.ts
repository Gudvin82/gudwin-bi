import { NextResponse } from "next/server";
import { paymentCalendar } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ items: paymentCalendar });
}
