import { Card } from "@/components/ui/card";

const providers = [
  { id: "aitunnel", name: "AI Tunnel", env: "AITUNNEL_API_KEY", modelEnv: "AI_MODEL" },
  { id: "openai", name: "OpenAI", env: "OPENAI_API_KEY", modelEnv: "AI_MODEL" },
  { id: "anthropic", name: "Anthropic", env: "ANTHROPIC_API_KEY", modelEnv: "ANTHROPIC_MODEL" },
  { id: "openrouter", name: "OpenRouter", env: "OPENROUTER_API_KEY", modelEnv: "OPENROUTER_MODEL" },
  { id: "yandex", name: "YandexGPT", env: "YANDEX_API_KEY", modelEnv: "YANDEX_MODEL" }
];

export default function AiKeysSettingsPage() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-white">
        <h2 className="text-xl font-bold">AI-провайдеры и ключи</h2>
        <p className="mt-1 text-sm text-muted">
          Подготовленный контур для подключения разных AI-моделей. В текущем релизе ключи задаются на сервере в `.env`.
        </p>
      </Card>

      <Card>
        <h3 className="mb-2 text-base font-semibold">Поддерживаемые провайдеры</h3>
        <div className="space-y-2">
          {providers.map((provider) => (
            <div key={provider.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-semibold">{provider.name}</p>
                <p className="text-xs text-muted">
                  Ключ: <code>{provider.env}</code> • Модель: <code>{provider.modelEnv}</code>
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">Готово к интеграции</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <p className="text-sm font-semibold">Безопасность</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-900">
          <li>Не храните ключи в GitHub и фронтенд-коде.</li>
          <li>Ключи задаются только на сервере в `.env`.</li>
          <li>После публикации ключа в чате или логах обязательно делайте ротацию.</li>
        </ul>
      </Card>
    </div>
  );
}
