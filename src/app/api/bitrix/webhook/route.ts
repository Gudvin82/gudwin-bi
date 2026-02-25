import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    received: Boolean(payload && Object.keys(payload).length),
    note: "Webhook Bitrix24 принят. В прод-режиме данные будут записаны в datasets.",
    _meta: { mode: "prod", generatedAt: new Date().toISOString() }
  });
}
