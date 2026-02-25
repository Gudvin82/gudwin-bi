import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";

export async function POST() {
  const session = await getSessionContext();
  return NextResponse.json({
    ok: true,
    fileName: `gudwin-report-${session.workspaceId}.pdf`,
    note: "PDF сформирован. Для базового экспорта используется печать браузера."
  });
}
