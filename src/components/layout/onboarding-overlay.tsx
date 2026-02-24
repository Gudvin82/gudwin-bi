"use client";

import { useEffect, useState } from "react";

const steps = [
  "Подключите данные в разделе «Источники данных».",
  "Перейдите в Smart Advisor и задайте вопрос по бизнесу.",
  "Включите Telegram/SMS отчеты в настройках."
];

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("gwbi_onboarding_done");
    if (!done) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-content-center bg-slate-950/55 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white p-6 shadow-soft animate-fade-up">
        <h3 className="mb-2 text-xl font-bold">Добро пожаловать в GudWin BI</h3>
        <p className="mb-4 text-sm text-muted">Пройдите короткий старт, чтобы получить первый рабочий результат.</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-text">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem("gwbi_onboarding_done", "1");
              setVisible(false);
            }}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Начать работу
          </button>
          <button
            onClick={() => setVisible(false)}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
