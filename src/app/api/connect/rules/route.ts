import { NextResponse } from "next/server";
import { integrationRules } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ rules: integrationRules });
}
