type GoogleTokenPayload = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

const tokenStore = new Map<string, GoogleTokenPayload>();

export function saveGoogleTokens(workspaceId: string, payload: GoogleTokenPayload) {
  tokenStore.set(workspaceId, payload);
}

export function getGoogleTokens(workspaceId: string) {
  return tokenStore.get(workspaceId) ?? null;
}

export function clearGoogleTokens(workspaceId: string) {
  tokenStore.delete(workspaceId);
}
