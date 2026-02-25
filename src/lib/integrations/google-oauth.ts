import { createHash } from "crypto";
import { getGoogleTokens, saveGoogleTokens } from "./google-store";

type GoogleTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

const GOOGLE_AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export function getGoogleOAuthConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? ""
  };
}

export function hasGoogleOAuthConfig() {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  return Boolean(clientId && clientSecret && redirectUri);
}

export function buildGoogleAuthUrl(state: string) {
  const { clientId, redirectUri } = getGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly"
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
    state
  });
  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}

export function signOAuthState(workspaceId: string, secret: string) {
  const payload = JSON.stringify({ workspaceId, ts: Date.now() });
  const hash = createHash("sha256").update(payload + secret).digest("hex");
  return Buffer.from(JSON.stringify({ payload, hash })).toString("base64url");
}

export function verifyOAuthState(state: string, secret: string) {
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf8")) as { payload: string; hash: string };
    const nextHash = createHash("sha256").update(decoded.payload + secret).digest("hex");
    if (nextHash !== decoded.hash) return null;
    const data = JSON.parse(decoded.payload) as { workspaceId: string; ts: number };
    return data.workspaceId;
  } catch {
    return null;
  }
}

export async function exchangeGoogleCode(code: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code"
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    throw new Error("Google token exchange failed");
  }
  return (await res.json()) as GoogleTokenResponse;
}

export async function refreshGoogleToken(refreshToken: string) {
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token"
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    throw new Error("Google token refresh failed");
  }
  return (await res.json()) as GoogleTokenResponse;
}

export async function getValidGoogleAccessToken(workspaceId: string) {
  const tokens = getGoogleTokens(workspaceId);
  if (!tokens?.accessToken) return null;

  const now = Date.now();
  if (tokens.expiresAt && tokens.expiresAt > now + 60_000) {
    return tokens.accessToken;
  }

  if (!tokens.refreshToken) {
    return tokens.accessToken;
  }

  try {
    const refreshed = await refreshGoogleToken(tokens.refreshToken);
    const expiresAt = refreshed.expires_in ? Date.now() + refreshed.expires_in * 1000 : tokens.expiresAt;
    saveGoogleTokens(workspaceId, {
      accessToken: refreshed.access_token,
      refreshToken: tokens.refreshToken,
      expiresAt
    });
    return refreshed.access_token;
  } catch {
    return tokens.accessToken;
  }
}
