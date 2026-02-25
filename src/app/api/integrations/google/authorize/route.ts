import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";
import { buildGoogleAuthUrl, hasGoogleOAuthConfig, signOAuthState } from "@/lib/integrations/google-oauth";

export async function GET() {
  const session = await getSessionContext();
  if (!hasGoogleOAuthConfig()) {
    return NextResponse.json({ ok: false, error: "Google OAuth не настроен." }, { status: 400 });
  }
  const secret = process.env.SESSION_SECRET ?? "gudwin";
  const state = signOAuthState(session.workspaceId, secret);
  const url = buildGoogleAuthUrl(state);
  return NextResponse.redirect(url);
}
