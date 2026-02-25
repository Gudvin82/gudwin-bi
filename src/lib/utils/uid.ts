export function uid(prefix = "id") {
  const canUseCrypto =
    typeof crypto !== "undefined"
    && typeof crypto.randomUUID === "function"
    && (typeof window === "undefined" || window.isSecureContext);

  if (canUseCrypto) {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback to deterministic uid below.
    }
  }
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}
