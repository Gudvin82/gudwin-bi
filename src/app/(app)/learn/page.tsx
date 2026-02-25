import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

export default function LearnPage() {
  return (
    <div className="space-y-5">
      <Card className="animate-fade-up bg-gradient-to-r from-cyan-50 via-white to-indigo-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Помощь и обучение</h2>
            <p className="mt-1 text-sm text-muted">
              Материалы для быстрого старта, ответы на частые вопросы и обучение по ключевым разделам GudWin BI.
            </p>
          </div>
          <HelpPopover
            title="Как пользоваться"
            items={[
              "Выберите формат: FAQ, быстрый старт или видео.",
              "В каждом разделе есть прямые кнопки возврата в продукт.",
              "Материалы построены на реальных сценариях SMB."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/learn/faq" className="block">
          <Card className="h-full bg-gradient-to-br from-sky-50 to-cyan-50 transition hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">FAQ</h3>
            <p className="mt-2 text-sm text-muted">Короткие ответы на типовые вопросы по данным, финансам, маркетингу и юридическому блоку.</p>
          </Card>
        </Link>
        <Link href="/learn/quick-start" className="block">
          <Card className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 transition hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">Быстрый старт</h3>
            <p className="mt-2 text-sm text-muted">Пошаговый сценарий «5 минут до ценности» с примерами ИИ-запросов и нужными переходами.</p>
          </Card>
        </Link>
        <Link href="/learn/guides" className="block">
          <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 transition hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">Гайды и статьи</h3>
            <p className="mt-2 text-sm text-muted">Практические материалы по Cash Guard, юнит-экономике, маркетингу и правовым проверкам.</p>
          </Card>
        </Link>
        <Link href="/learn/videos" className="block">
          <Card className="h-full bg-gradient-to-br from-violet-50 to-indigo-50 transition hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">Видео-обучение</h3>
            <p className="mt-2 text-sm text-muted">Короткие ролики, чтобы быстро повторить ключевые сценарии и показать продукт команде.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
