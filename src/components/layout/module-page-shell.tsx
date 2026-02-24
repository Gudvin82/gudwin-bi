import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type ModulePageShellProps = {
  title: string;
  subtitle: string;
  whatItDoes: string[];
  blocks: Array<{
    title: string;
    description: string;
    href?: string;
    hrefLabel?: string;
  }>;
};

export function ModulePageShell({ title, subtitle, whatItDoes, blocks }: ModulePageShellProps) {
  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-slate-50 via-cyan-50/45 to-zinc-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="premium-title text-xl font-extrabold">{title}</h2>
            <p className="premium-subtitle text-sm">{subtitle}</p>
          </div>
          <HelpPopover
            title="Как использовать этот экран"
            items={whatItDoes}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map((block) => (
          <Card key={block.title} className="animate-fade-up">
            <h3 className="premium-title mb-2 text-base font-bold">{block.title}</h3>
            <p className="mb-3 text-sm text-muted">{block.description}</p>
            {block.href ? (
              <Link href={block.href} className="premium-nav-chip rounded-xl px-3 py-2 text-sm font-semibold">
                {block.hrefLabel ?? "Открыть"}
              </Link>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
