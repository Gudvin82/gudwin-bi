"use client";

import { useMemo, useState } from "react";

type AuthMethod = "phone" | "email" | "telegram";

export function AuthEntry({ nextPath, isError }: { nextPath: string; isError: boolean }) {
  const [method, setMethod] = useState<AuthMethod>("phone");
  const [hint, setHint] = useState("");

  const placeholder = useMemo(() => {
    if (method === "phone") return "+7 (___) ___-__-__";
    if (method === "email") return "owner@company.ru";
    return "@your_telegram";
  }, [method]);

  const methodLabel = useMemo(() => {
    if (method === "phone") return "Вход по номеру телефона";
    if (method === "email") return "Вход по электронной почте";
    return "Вход через Telegram";
  }, [method]);

  const onStubAuth = () => {
    setHint("Этот способ входа пока в режиме заглушки. Используйте PIN-код ниже.");
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">GudWin BI</p>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Вход в портал</h1>
      <p className="mt-1 text-sm text-slate-600">Выберите способ входа. Для текущего этапа доступ через PIN-код.</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setMethod("phone")}
          className={`rounded-xl border px-2 py-2 text-xs font-semibold ${method === "phone" ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-700"}`}
        >
          Телефон
        </button>
        <button
          type="button"
          onClick={() => setMethod("email")}
          className={`rounded-xl border px-2 py-2 text-xs font-semibold ${method === "email" ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-700"}`}
        >
          Почта
        </button>
        <button
          type="button"
          onClick={() => setMethod("telegram")}
          className={`rounded-xl border px-2 py-2 text-xs font-semibold ${method === "telegram" ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-700"}`}
        >
          Telegram
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">{methodLabel}</p>
        <input
          type="text"
          readOnly
          placeholder={placeholder}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-500"
        />
        <button
          type="button"
          onClick={onStubAuth}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Продолжить (скоро)
        </button>
        {hint ? <p className="mt-2 text-xs text-amber-700">{hint}</p> : null}
      </div>

      <div className="my-4 h-px bg-slate-200" />

      <p className="text-sm font-semibold text-slate-900">Вход по мастер-PIN</p>
      <p className="mt-1 text-xs text-slate-600">Рабочий способ для текущего этапа тестирования.</p>
      {isError ? <p className="mt-3 text-sm text-rose-700">Неверный PIN-код. Попробуйте снова.</p> : null}
      <form action={`/api/auth/pin-form?next=${encodeURIComponent(nextPath)}`} method="post" className="mt-3 space-y-3">
        <input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          name="pin"
          placeholder="Введите PIN-код"
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-cyan-200 transition focus:border-cyan-500 focus:ring"
        />
        <button className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white">
          Войти
        </button>
      </form>
    </section>
  );
}
