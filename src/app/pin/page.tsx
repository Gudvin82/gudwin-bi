import { PinForm } from "./pin-form";

type PinPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function PinPage({ searchParams }: PinPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/owner";

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top,_#ecfeff,_#f8fafc_45%,_#e2e8f0)] px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">GudWin BI</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Вход в портал</h1>
        <p className="mt-1 text-sm text-slate-600">Введите PIN-код для доступа к системе.</p>
        <PinForm nextPath={nextPath} />
      </section>
    </main>
  );
}
