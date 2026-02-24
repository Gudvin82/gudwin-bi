import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "gudwin-bi", timestamp: new Date().toISOString() });
}
