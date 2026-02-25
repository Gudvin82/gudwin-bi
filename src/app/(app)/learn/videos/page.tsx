import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";
import { videoItems } from "@/lib/learn-content";

const sectionLabels: Record<string, string> = {
  all: "Все разделы",
  general: "Общее",
  sources: "Подключение данных",
  owner: "Режим владельца",
  finance: "Финансы",
  marketing: "Маркетинг",
  legal: "Юридический блок"
};

type LearnVideosPageProps = {
  searchParams?: Promise<{ section?: string }>;
};

export default async function LearnVideosPage({ searchParams }: LearnVideosPageProps) {
  const params = (await searchParams) ?? {};
  const section = params.section ?? "all";
  const items = section === "all" ? videoItems : videoItems.filter((item) => item.section === section);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Видео-обучение</h2>
            <p className="mt-1 text-sm text-muted">Смотрите короткие ролики и повторяйте шаги в интерфейсе сразу после просмотра.</p>
          </div>
          <HelpPopover
            title="Как использовать видео"
            items={[
              "Выберите тему и откройте ролик.",
              "Повторите шаги в интерфейсе.",
              "Используйте быстрый старт для закрепления."
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          {Object.entries(sectionLabels).map(([id, label]) => (
            <Link key={id} href={`/learn/videos?section=${id}`} className={`rounded-xl border px-3 py-2 text-sm ${section === id ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-border"}`}>
              {label}
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <p className="text-xs text-muted">Длительность: {item.duration}</p>
            <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={item.href} target="_blank" rel="noreferrer" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white">
                Открыть видео
              </a>
              <Link href="/learn/quick-start" className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
                Попробовать в продукте
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
