"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PinFormProps = {
  nextPath: string;
};

export function PinForm({ nextPath }: PinFormProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Не удалось выполнить вход.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Ошибка соединения. Повторите попытку.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <input
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Введите PIN-код"
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-cyan-200 transition focus:border-cyan-500 focus:ring"
      />
      <button
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Проверяем..." : "Войти"}
      </button>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
