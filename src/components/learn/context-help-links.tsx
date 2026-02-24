import Link from "next/link";
import { Card } from "@/components/ui/card";

type ContextHelpLinksProps = {
  section: string;
  title?: string;
};

export function ContextHelpLinks({ section, title = "Помощь по этому разделу" }: ContextHelpLinksProps) {
  return (
    <Card className="border-slate-200 bg-gradient-to-r from-white to-slate-50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted">Короткие ответы, пошаговые инструкции и видео по текущему экрану.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/learn/faq?section=${section}`} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
            FAQ по разделу
          </Link>
          <Link href={`/learn/videos?section=${section}`} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
            Видео по разделу
          </Link>
          <Link href={`/learn/guides?section=${section}`} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
            Полный гайд
          </Link>
        </div>
      </div>
    </Card>
  );
}
