"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

export default function DocsPage() {
  const [template, setTemplate] = useState("contract");
  const [client, setClient] = useState("ООО Альфа");
  const [inn, setInn] = useState("7701234567");
  const [result, setResult] = useState<string>("");
  const [counterpartyCheck, setCounterpartyCheck] = useState<string>("");
  const [lawSummary, setLawSummary] = useState<string>("");
  const [candidateName, setCandidateName] = useState("Иванов Иван Иванович");
  const [candidatePassport, setCandidatePassport] = useState("4510123456");
  const [candidateInn, setCandidateInn] = useState("7701002003");
  const [candidateConsent, setCandidateConsent] = useState(true);
  const [candidateResult, setCandidateResult] = useState<string>("");

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
    setCounterpartyCheck(`${json.status.toUpperCase()}: ${json.comment}. Источник: ${json.source}.`);

    const summaryRes = await fetch("/api/law/risk-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        counterpartyName: client,
        counterpartyStatus: json.status,
        riskFactors: json.profile?.risk_factors ?? [],
        contractText: result
      })
    });
    const summary = await summaryRes.json();
    setLawSummary(`${summary.summary} Флаги: ${(summary.flags ?? []).join(", ")}. ${summary.disclaimer}`);
  };

  const checkCandidate = async () => {
    const res = await fetch("/api/law/check-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: candidateName,
        passport: candidatePassport,
        inn: candidateInn,
        consent: candidateConsent
      })
    });
    const json = await res.json();
    setCandidateResult(res.ok ? `${json.status}: ${json.summary}` : json.error ?? "Ошибка проверки кандидата");
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Документы и право (Smart Docs & Law)</h2>
            <p className="text-sm text-muted">Здесь вы проверяете контрагентов и кандидатов на риски и работаете с документами.</p>
          </div>
          <HelpPopover
            title="Что делает раздел"
            items={[
              "Создает базовые документы и помогает со сверкой по сканам.",
              "Показывает риск-профиль контрагента по данным внешней проверки.",
              "Проверяет кандидата при наличии согласия по 152-ФЗ."
            ]}
          />
        </div>
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
          <h3 className="mb-3 text-base font-semibold">Проверка контрагента по ФНС</h3>
          <input value={inn} onChange={(e) => setInn(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="ИНН" />
          <button onClick={checkCounterparty} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Проверить</button>
          {counterpartyCheck ? <p className="mt-3 text-sm text-muted">{counterpartyCheck}</p> : null}
          {lawSummary ? <p className="mt-2 rounded-xl border border-border bg-slate-50 p-3 text-sm">{lawSummary}</p> : null}
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Проверка кандидата (Smart Hire + Law)</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="rounded-xl border border-border p-2 text-sm" placeholder="ФИО" />
          <input value={candidatePassport} onChange={(e) => setCandidatePassport(e.target.value)} className="rounded-xl border border-border p-2 text-sm" placeholder="Паспорт" />
          <input value={candidateInn} onChange={(e) => setCandidateInn(e.target.value)} className="rounded-xl border border-border p-2 text-sm" placeholder="ИНН" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={candidateConsent} onChange={(e) => setCandidateConsent(e.target.checked)} />
            Согласие на проверку (152-ФЗ)
          </label>
        </div>
        <button onClick={checkCandidate} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Проверить кандидата</button>
        {candidateResult ? <p className="mt-2 text-sm text-muted">{candidateResult}</p> : null}
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <p className="text-sm font-semibold">Дисклеймер</p>
        <p className="text-sm text-amber-900">
          AI-юрист формирует risk summary и не заменяет профессиональную юридическую экспертизу. Проверка персональных данных возможна только при наличии согласия.
        </p>
      </Card>
    </div>
  );
}
