import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PIN_COOKIE_NAME, PIN_COOKIE_VALUE } from "@/lib/auth/pin";
import { AuthEntry } from "@/components/auth/auth-entry";

type PinPageProps = {
  searchParams?: Promise<{ next?: string; error?: string }>;
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
      <AuthEntry nextPath={nextPath} isError={isError} />
    </main>
  );
}
