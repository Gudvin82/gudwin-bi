"use client";

import { useState } from "react";
import Link from "next/link";

type AccordionItem = {
  question: string;
  answer: string;
  linkLabel?: string;
  linkHref?: string;
};

type FaqAccordionProps = {
  categoryId: string;
  items: AccordionItem[];
};

export function FaqAccordion({ categoryId, items }: FaqAccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const key = `${categoryId}-${item.question}`;
        const opened = openKey === key;
        return (
          <div key={key} className="rounded-xl border border-border">
            <button className="w-full px-3 py-3 text-left text-sm font-semibold" onClick={() => setOpenKey(opened ? null : key)}>
              {item.question}
            </button>
            {opened ? (
              <div className="border-t border-border px-3 py-3 text-sm text-muted">
                <p>{item.answer}</p>
                {item.linkHref ? (
                  <Link href={item.linkHref} className="mt-2 inline-flex rounded-lg border border-border px-2 py-1 text-xs font-medium text-text">
                    {item.linkLabel ?? "Открыть"}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
