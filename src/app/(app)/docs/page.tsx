"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function DocsPage() {
  const [template, setTemplate] = useState("contract");
  const [client, setClient] = useState("ООО Альфа");
  const [inn, setInn] = useState("7701234567");
  const [result, setResult] = useState<string>("");
  const [counterpartyCheck, setCounterpartyCheck] = useState<string>("");

  const generateDoc = async () => {
    const res = await fetch("/api/docs/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, client, amount: 125000 })
    });
    const json = await res.json();
    setResult(json.preview ?? "");
  };

  const scanDoc = async () => {
    const res = await fetch("/api/docs/scan", { method: "POST" });
    const json = await res.json();
    setResult(`OCR: ${json.extracted.counterparty}, ${json.extracted.amount} ₽, ${json.extracted.date}. ${json.notes?.join("; ")}`);
  };

  const checkCounterparty = async () => {
    const res = await fetch("/api/law/check-counterparty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inn })
    });
    const json = await res.json();
    setCounterpartyCheck(`${json.status.toUpperCase()}: ${json.comment}`);
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-orange-50 to-amber-50">
        <h2 className="text-xl font-bold">Smart Docs & Law</h2>
        <p className="text-sm text-muted">Документы, OCR-сканы, сверка, базовая проверка контрагентов.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Создание документа</h3>
          <div className="grid gap-2">
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="rounded-xl border border-border p-2 text-sm">
              <option value="contract">Договор</option>
              <option value="invoice">Счет</option>
              <option value="act">Акт</option>
              <option value="proposal">Коммерческое предложение</option>
            </select>
            <input value={client} onChange={(e) => setClient(e.target.value)} className="rounded-xl border border-border p-2 text-sm" placeholder="Клиент" />
          </div>
          <button onClick={generateDoc} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Создать документ</button>
          <button onClick={scanDoc} className="mt-3 ml-2 rounded-xl border border-border px-4 py-2 text-sm">Сканировать документ</button>
          {result ? <p className="mt-3 text-sm text-muted">{result}</p> : null}
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Smart Law: проверка контрагента</h3>
          <input value={inn} onChange={(e) => setInn(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="ИНН" />
          <button onClick={checkCounterparty} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Проверить</button>
          {counterpartyCheck ? <p className="mt-3 text-sm text-muted">{counterpartyCheck}</p> : null}
        </Card>
      </div>
    </div>
  );
}
