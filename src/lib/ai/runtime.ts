export function isAiRuntimeEnabled() {
  return process.env.AI_RUNTIME_ENABLED === "true";
}

export function resolveAiRuntime() {
  const enabled = isAiRuntimeEnabled();
  const hasKey = Boolean(process.env.AITUNNEL_API_KEY || process.env.OPENAI_API_KEY);
  const provider = process.env.AITUNNEL_API_KEY ? "aitunnel" : process.env.OPENAI_API_KEY ? "openai" : "none";
  const model = process.env.AI_MODEL || "gpt-4.1-mini";

  return {
    enabled,
    hasKey,
    provider,
    model
  };
}
