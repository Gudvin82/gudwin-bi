"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

const blocks = [
  { id: "summary", label: "Краткое резюме" },
  { id: "finance", label: "Финансы и касса" },
  { id: "sales", label: "Продажи и каналы" },
  { id: "risks", label: "Риски и предупреждения" },
  { id: "actions", label: "Что сделать дальше" }
];

export default function ReportBuilderPage() {
  const [name, setName] = useState("Ежедневный отчёт собственника");
  const [period, setPeriod] = useState("вчера");
  const [channel, setChannel] = useState("telegram");
  const [selected, setSelected] = useState<string[]>(["summary", "finance", "actions"]);
  const [generated, setGenerated] = useState("");

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const generate = () => {
    setGenerated(
      `Отчёт «${name}» за период: ${period}.\n\n` +
        `Секции: ${selected.map((id) => blocks.find((b) => b.id === id)?.label).join(", ")}.\n` +
        "Ключевой вывод: выручка выше плана, но есть риск кассового разрыва через 12 дней.\n" +
        "Рекомендация: ускорить сбор дебиторки и сократить низкоэффективные расходы."
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-sky-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Конструктор отчётов</h2>
            <p className="text-sm text-muted">Соберите управленческий отчёт под свой сценарий и канал доставки.</p>
          </div>
          <HelpPopover
            title="Как использовать"
            items={[
              "Выберите период и блоки отчета.",
              "Сгенерируйте черновик текста.",
              "Отправьте в Telegram или сохраните как шаблон."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Параметры отчёта</h3>
          <div className="space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Название отчета" />
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-xl border border-border p-2 text-sm">
                <option value="вчера">Вчера</option>
                <option value="последние 7 дней">Последние 7 дней</option>
                <option value="месяц">Месяц</option>
              </select>
              <select value={channel} onChange={(e) => setChannel(e.target.value)} className="rounded-xl border border-border p-2 text-sm">
                <option value="telegram">Telegram</option>
                <option value="sms">SMS</option>
                <option value="web">Web</option>
              </select>
            </div>
          </div>

          <p className="mt-3 text-sm font-semibold">Секции отчёта</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {blocks.map((block) => (
              <label key={block.id} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white p-2 text-sm">
                <input type="checkbox" checked={selected.includes(block.id)} onChange={() => toggle(block.id)} />
                {block.label}
              </label>
            ))}
          </div>

          <button onClick={generate} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Сгенерировать черновик</button>
        </Card>

        <Card>
          <h3 className="mb-2 text-base font-semibold">Предпросмотр отчёта</h3>
          <p className="mb-3 text-xs text-muted">Канал отправки: {channel.toUpperCase()}</p>
          <pre className="min-h-52 whitespace-pre-wrap rounded-xl border border-border bg-white p-3 text-sm">
            {generated || "Нажмите «Сгенерировать черновик», чтобы увидеть итоговый текст отчёта."}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-xl border border-border px-3 py-2 text-sm">Сохранить как шаблон</button>
            <button className="rounded-xl border border-border px-3 py-2 text-sm">Отправить в Telegram</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
