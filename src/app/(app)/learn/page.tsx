"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type FaqItem = { q: string; a: string };

export default function LearnPage() {
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [question, setQuestion] = useState("Как быстро показать инвестору ценность GudWin BI?");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/learn/faq");
      const json = await res.json();
      setFaq(json.faq ?? []);
    };
    void load();
  }, []);

  const ask = () => {
    setAnswer("Запустите Demo Mode, откройте Owner Mode, затем Smart Advisor и Smart Finance. Покажите Health Score, Money Leaks и Action rules.");
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-bold">Smart Learn / FAQ</h2>
        <p className="text-sm text-muted">Обучение пользователей, FAQ и AI-помощник по продукту.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">FAQ</h3>
          <div className="space-y-2 text-sm">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-border p-3">
                <p className="font-semibold">{item.q}</p>
                <p className="text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">AI-FAQ чат</h3>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="min-h-24 w-full rounded-xl border border-border p-3 text-sm" />
          <button onClick={ask} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Спросить</button>
          {answer ? <p className="mt-3 rounded-xl border border-border p-3 text-sm">{answer}</p> : null}
        </Card>
      </div>
    </div>
  );
}
