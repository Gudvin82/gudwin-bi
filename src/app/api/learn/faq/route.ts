import { NextResponse } from "next/server";
import { learnFaq } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ faq: learnFaq, _meta: { mode: "demo", generatedAt: new Date().toISOString() } });
}
