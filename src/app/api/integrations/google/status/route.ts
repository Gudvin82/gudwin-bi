import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";
import { getGoogleTokens } from "@/lib/integrations/google-store";
import { hasGoogleOAuthConfig } from "@/lib/integrations/google-oauth";

export async function GET() {
  const session = await getSessionContext();
  const tokens = getGoogleTokens(session.workspaceId);
  return NextResponse.json({
    configured: hasGoogleOAuthConfig(),
    connected: Boolean(tokens?.accessToken),
    expiresAt: tokens?.expiresAt ?? null
  });
}
