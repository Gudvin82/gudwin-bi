"use client";

import Link from "next/link";
import { useEffect } from "react";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error("App route error:", error);
  }, [error]);

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Системная ошибка</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">Что-то пошло не так</h1>
      <p className="mt-3 text-sm text-slate-600">
        Мы зафиксировали проблему. Попробуйте перезагрузить раздел или вернуться на главный экран.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(8,145,178,0.3)]"
        >
          Перезагрузить раздел
        </button>
        <Link
          href="/owner"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          На главный экран
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        Если ошибка повторяется, напишите в поддержку и укажите время события. Код: {error.digest ?? "n/a"}
      </div>
    </section>
  );
}
