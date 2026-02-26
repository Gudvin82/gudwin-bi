export function uid(prefix = "id") {
  const fallback = () => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

  // В браузере используем безопасный детерминированный fallback,
  // чтобы не зависеть от доступности crypto.randomUUID в http/legacy окружении.
  if (typeof window !== "undefined") {
    return fallback();
  }

  const canUseCrypto =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function";

  if (canUseCrypto) {
    try {
      return crypto.randomUUID();
    } catch {
      // ignore and fallback
    }
  }
  return fallback();
}
