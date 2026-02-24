import { NextResponse } from "next/server";
import { marketingExperiments } from "@/lib/demo-os";

export async function GET() {
  return NextResponse.json({ experiments: marketingExperiments });
}
