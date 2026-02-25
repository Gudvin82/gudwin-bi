import { NextResponse } from "next/server";
import { exchangeGoogleCode, verifyOAuthState } from "@/lib/integrations/google-oauth";
import { saveGoogleTokens } from "@/lib/integrations/google-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code || !state) {
    return NextResponse.json({ ok: false, error: "Missing code or state" }, { status: 400 });
  }

  const secret = process.env.SESSION_SECRET ?? "gudwin";
  const workspaceId = verifyOAuthState(state, secret);
  if (!workspaceId) {
    return NextResponse.json({ ok: false, error: "Invalid state" }, { status: 400 });
  }

  try {
    const tokenResponse = await exchangeGoogleCode(code);
    const expiresAt = tokenResponse.expires_in ? Date.now() + tokenResponse.expires_in * 1000 : undefined;
    saveGoogleTokens(workspaceId, {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt
    });
    const redirectTo = process.env.GOOGLE_REDIRECT_SUCCESS ?? "/sources";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  } catch {
    return NextResponse.json({ ok: false, error: "OAuth exchange failed" }, { status: 500 });
  }
}
