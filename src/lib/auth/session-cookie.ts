import crypto from "crypto";

export const SESSION_COOKIE_NAME = "gw_session";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 14;

export type SessionPayload = {
  userId: string;
  workspaceId: string;
  role: "owner" | "member";
  issuedAt: number;
};

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.PORTAL_PIN_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    return null;
  }
  return secret ?? "dev-session-secret";
}

export function signSession(payload: SessionPayload) {
  const secret = getSessionSecret();
  if (!secret) return null;
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySession(value?: string | null) {
  if (!value) return null;
  const secret = getSessionSecret();
  if (!secret) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: DEFAULT_MAX_AGE
  };
}
