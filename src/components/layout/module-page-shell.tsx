import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type ModulePageShellProps = {
  title: string;
  subtitle: string;
  whatItDoes: string[];
  status?: "mvp" | "v2";
  blocks: Array<{
    title: string;
    description: string;
    href?: string;
    hrefLabel?: string;
  }>;
};

export function ModulePageShell({ title, subtitle, whatItDoes, status = "mvp", blocks }: ModulePageShellProps) {
  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-slate-50 to-zinc-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
          <HelpPopover
            title="Как использовать этот экран"
            items={whatItDoes}
          />
        </div>
      </Card>

      <Card>
        <p className="text-sm text-muted">
          Статус модуля: {status === "mvp" ? "MVP" : "Дорожная карта v2+"}. Раздел уже встроен в архитектуру и готов к расширению без переделки меню.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map((block) => (
          <Card key={block.title} className="animate-fade-up">
            <h3 className="mb-2 text-base font-semibold">{block.title}</h3>
            <p className="mb-3 text-sm text-muted">{block.description}</p>
            {block.href ? (
              <Link href={block.href} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
                {block.hrefLabel ?? "Открыть"}
              </Link>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
