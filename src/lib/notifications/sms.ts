export interface SmsProvider {
  send(input: { to: string; message: string }): Promise<{ ok: boolean; providerMessageId?: string }>;
}

export class HttpSmsProvider implements SmsProvider {
  async send(input: { to: string; message: string }) {
    const endpoint = process.env.SMS_PROVIDER_URL;
    const apiKey = process.env.SMS_PROVIDER_API_KEY;
    if (!endpoint || !apiKey) {
      return { ok: false };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(input)
    });

    return { ok: res.ok, providerMessageId: res.headers.get("x-message-id") ?? undefined };
  }
}
