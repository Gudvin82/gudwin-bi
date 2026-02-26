"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type SupportMessage = { id: string; from: "you" | "support"; text: string };

export default function ContactsPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<SupportMessage[]>([
    { id: "m1", from: "support", text: "Здравствуйте. Мы на связи, опишите задачу, и мы подскажем ближайший план работ." }
  ]);

  const submit = async () => {
    try {
      const res = await fetch("/api/contacts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message })
      });
      setStatus(res.ok ? "Заявка отправлена команде разработки." : "Ошибка отправки заявки.");
      if (!res.ok) {
        setError("Не удалось отправить заявку.");
      }
    } catch {
      setStatus("Ошибка отправки заявки.");
      setError("Не удалось отправить заявку.");
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChat((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, from: "you", text: chatInput.trim() },
      {
        id: `s-${Date.now()}`,
        from: "support",
        text: "Запрос принят. В рабочее время ответим с оценкой сроков и объема доработки."
      }
    ]);
    setChatInput("");
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-emerald-50 to-lime-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Контакты разработчиков</h2>
            <p className="text-sm text-muted">Связь с командой GudWin BI: поддержка, внедрение, кастомные модули.</p>
            {error ? <p className="mt-2 text-xs font-semibold text-amber-700">{error}</p> : null}
          </div>
          <HelpPopover
            title="Когда использовать"
            items={[
              "Если нужна доработка или интеграция под ваш бизнес.",
              "Чтобы обсудить внедрение и сроки.",
              "Для вопросов по функционалу и тарифам."
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-base font-semibold">Контакты</h3>
          <p className="text-sm">Email: dev@gudwin.bi</p>
          <p className="text-sm">Telegram: @gudwin_dev_team</p>
          <p className="text-sm">Сайт: gudwin.bi</p>
        </Card>

        <Card>
          <h3 className="mb-2 text-base font-semibold">Чат с техподдержкой</h3>
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border bg-white p-3">
            {chat.map((item) => (
              <div key={item.id} className={`rounded-lg px-3 py-2 text-sm ${item.from === "you" ? "ml-8 bg-cyan-100" : "mr-8 bg-slate-100"}`}>
                <p className="text-xs text-muted">{item.from === "you" ? "Вы" : "Поддержка"}</p>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Опишите вопрос для команды разработки" />
            <button onClick={sendChat} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Отправить</button>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <h3 className="mb-2 text-base font-semibold">Заказать доработку</h3>
          <div className="space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Компания" />
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Контакт" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-24 w-full rounded-xl border border-border p-2 text-sm" placeholder="Описание задачи" />
          </div>
          <button onClick={submit} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Отправить заявку</button>
          {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
        </Card>
      </div>
    </div>
  );
}
