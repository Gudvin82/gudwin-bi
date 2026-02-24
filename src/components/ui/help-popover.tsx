"use client";

import { useState } from "react";
import { X } from "lucide-react";

type HelpPopoverProps = {
  title: string;
  items: string[];
};

export function HelpPopover({ title, items }: HelpPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-xs font-bold text-muted hover:text-text"
        aria-label="Открыть подсказку"
      >
        ?
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-content-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-4 shadow-soft animate-fade-up">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold">{title}</p>
              <button onClick={() => setOpen(false)} aria-label="Закрыть подсказку" className="rounded-md p-1 text-muted hover:bg-slate-100">
                <X size={14} />
              </button>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
