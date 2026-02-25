"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

type AiResponse = {
  summary: string;
  sql: string;
  visualization: "table" | "metric" | "line" | "bar";
  isFallback?: boolean;
  previewRows: Array<Record<string, string | number>>;
};

const dataSets = [
  { id: "all", label: "Все данные workspace" },
  { id: "sales", label: "Продажи" },
  { id: "leads", label: "Лиды" },
  { id: "crm", label: "CRM сделки" }
];

export default function AiPage() {
  const [query, setQuery] = useState("Покажи выручку по месяцам за последний год и средний чек по каналам продаж");
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templateMessage, setTemplateMessage] = useState<string | null>(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query, datasetIds: selectedDatasets })
      });

      if (!res.ok) {
        throw new Error("ИИ-запрос не выполнился. Попробуйте ещё раз.");
      }

      const json = (await res.json()) as AiResponse;
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка выполнения.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    setTemplateMessage(null);

    const res = await fetch("/api/report-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: query.slice(0, 60),
        prompt: query,
        datasetIds: selectedDatasets,
        channels: ["telegram"]
      })
    });

    setTemplateMessage(res.ok ? "Шаблон сохранен." : "Не удалось сохранить шаблон.");
  };

  const toggleDataset = (id: string) => {
    if (id === "all") {
      setSelectedDatasets(["all"]);
      return;
    }

    setSelectedDatasets((prev) => {
      const withoutAll = prev.filter((item) => item !== "all");
      if (withoutAll.includes(id)) {
        return withoutAll.filter((item) => item !== id);
      }
      return [...withoutAll, id];
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">ИИ-вопрос к данным</h2>
        <textarea
          className="min-h-28 w-full rounded-xl border border-border p-3 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Опишите, какие метрики и графики вы хотите"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {dataSets.map((item) => {
            const checked = selectedDatasets.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleDataset(item.id)}
                className={`rounded-xl border px-3 py-1.5 text-xs ${checked ? "border-accent bg-accentSoft text-accent" : "border-border text-muted"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button onClick={runQuery} disabled={loading} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Выполняется..." : "Сформировать отчет"}
          </button>
          <button onClick={saveTemplate} className="rounded-xl border border-border px-4 py-2 text-sm">
            Сохранить как шаблон
          </button>
        </div>

        {templateMessage ? <p className="mt-2 text-xs text-muted">{templateMessage}</p> : null}
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      ) : null}

      {!result && !loading && !error ? (
        <Card>
          <p className="text-sm text-muted">Пока нет результатов. Сформулируйте вопрос и нажмите «Сформировать отчет».</p>
        </Card>
      ) : null}

      {result ? (
        <Card>
          <h3 className="mb-2 text-base font-semibold">Результат</h3>
          <p className="mb-3 text-sm text-muted">{result.summary}</p>
          {result.isFallback ? <p className="mb-3 text-xs text-amber-700">ИИ-провайдер не подключен. Подключите ключ в «Настройки → ИИ‑провайдеры и ключи».</p> : null}
          <p className="mb-1 text-xs font-semibold text-muted">SQL</p>
          <pre className="mb-4 overflow-x-auto rounded-xl border border-border bg-slate-50 p-3 text-xs">{result.sql}</pre>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(result.previewRows[0] ?? {}).map((key) => (
                    <th key={key} className="py-2 capitalize">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.previewRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/70">
                    {Object.values(row).map((val, vIdx) => (
                      <td key={vIdx} className="py-2">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
