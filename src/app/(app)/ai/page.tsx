"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

type AiResponse = {
  summary: string;
  sql: string;
  visualization: "table" | "metric" | "line" | "bar";
  previewRows: Array<Record<string, string | number>>;
};

export default function AiPage() {
  const [query, setQuery] = useState("Покажи выручку по месяцам за последний год и средний чек по каналам продаж");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const runQuery = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: query, datasetIds: ["all"] })
    });
    const json = (await res.json()) as AiResponse;
    setResult(json);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">AI-запрос</h2>
        <textarea
          className="min-h-28 w-full rounded-xl border border-border p-3 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Опишите, какие метрики и графики вы хотите"
        />
        <div className="mt-3 flex items-center gap-2">
          <button onClick={runQuery} disabled={loading} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Выполняется..." : "Сформировать отчёт"}
          </button>
          <button className="rounded-xl border border-border px-4 py-2 text-sm">Сохранить как шаблон</button>
        </div>
      </Card>

      {result ? (
        <Card>
          <h3 className="mb-2 text-base font-semibold">Результат</h3>
          <p className="mb-3 text-sm text-muted">{result.summary}</p>
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
