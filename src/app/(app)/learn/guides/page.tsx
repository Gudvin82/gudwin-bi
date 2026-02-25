import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";
import { guideItems } from "@/lib/learn-content";

export default function LearnGuidesPage() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Гайды и статьи</h2>
            <p className="mt-1 text-sm text-muted">Короткие материалы, чтобы быстро разобраться в метриках и сразу применить их в работе.</p>
          </div>
          <HelpPopover
            title="Как использовать гайды"
            items={[
              "Читайте инструкцию и сразу применяйте шаги.",
              "Каждый гайд привязан к разделу продукта.",
              "Шаги можно выполнять в любом порядке."
            ]}
          />
        </div>
      </Card>

      <div className="space-y-3">
        {guideItems.map((guide) => (
          <Card key={guide.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted">{guide.category} • {guide.readTime}</p>
                <h3 className="mt-1 text-base font-semibold">{guide.title}</h3>
                <p className="mt-1 text-sm text-muted">{guide.description}</p>
              </div>
              <Link href={guide.href} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
                Применить в GudWin BI
              </Link>
            </div>
            <div className="mt-3 rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Что сделать</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
                {guide.applySteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
