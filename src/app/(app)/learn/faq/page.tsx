import Link from "next/link";
import { Card } from "@/components/ui/card";
import { faqCategories } from "@/lib/learn-content";
import { FaqAccordion } from "./section-accordion";

type LearnFaqPageProps = {
  searchParams?: Promise<{ section?: string }>;
};

export default async function LearnFaqPage({ searchParams }: LearnFaqPageProps) {
  const params = (await searchParams) ?? {};
  const section = params.section ?? "all";
  const categories = section === "all" ? faqCategories : faqCategories.filter((item) => item.id === section);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-white">
        <h2 className="text-2xl font-extrabold tracking-tight">FAQ</h2>
        <p className="mt-1 text-sm text-muted">
          Быстрые ответы по работе с GudWin BI. Если не нашли нужное, откройте «Контакты разработки».
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Link href="/learn/faq?section=all" className={`rounded-xl border px-3 py-2 text-sm ${section === "all" ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-border"}`}>Все</Link>
          {faqCategories.map((category) => (
            <Link
              key={category.id}
              href={`/learn/faq?section=${category.id}`}
              className={`rounded-xl border px-3 py-2 text-sm ${section === category.id ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-border"}`}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </Card>

      {categories.map((category) => (
        <Card key={category.id}>
          <h3 className="mb-3 text-base font-semibold">{category.title}</h3>
          <FaqAccordion categoryId={category.id} items={category.items} />
        </Card>
      ))}
    </div>
  );
}
