import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";

type PinPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function PinPage({ searchParams }: PinPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/owner";
  const isError = params.error === "invalid";
  const cookieStore = await cookies();
  if (cookieStore.get(PIN_COOKIE_NAME)?.value === PIN_COOKIE_VALUE) {
    redirect(nextPath);
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top,_#ecfeff,_#f8fafc_45%,_#e2e8f0)] px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">GudWin BI</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Вход в портал</h1>
        <p className="mt-1 text-sm text-slate-600">Введите PIN-код для доступа к системе.</p>
        {isError ? <p className="mt-3 text-sm text-rose-700">Неверный PIN-код. Попробуйте снова.</p> : null}
        <form action={`/api/auth/pin-form?next=${encodeURIComponent(nextPath)}`} method="post" className="mt-5 space-y-3">
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
    </main>
  );
}
