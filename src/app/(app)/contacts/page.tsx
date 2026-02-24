"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function ContactsPage() {
  const [name, setName] = useState("ООО Пример");
  const [contact, setContact] = useState("owner@example.com");
  const [message, setMessage] = useState("Нужна доработка модуля прогнозирования спроса и интеграции с банком.");
  const [status, setStatus] = useState("");

  const submit = async () => {
    const res = await fetch("/api/contacts/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, message })
    });
    setStatus(res.ok ? "Заявка отправлена команде разработки." : "Ошибка отправки заявки.");
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-emerald-50 to-lime-50">
        <h2 className="text-xl font-bold">Контакты разработчиков</h2>
        <p className="text-sm text-muted">Связь с командой GudWin BI: поддержка, внедрение, кастомные модули.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-base font-semibold">Контакты</h3>
          <p className="text-sm">Email: dev@gudwin.bi</p>
          <p className="text-sm">Telegram: @gudwin_dev_team</p>
          <p className="text-sm">Сайт: gudwin.bi</p>
        </Card>

        <Card>
          <h3 className="mb-2 text-base font-semibold">Заказать доработку</h3>
          <div className="space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Компания" />
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full rounded-xl border border-border p-2 text-sm" placeholder="Контакт" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-24 w-full rounded-xl border border-border p-2 text-sm" placeholder="Описание задачи" />
          </div>
          <button onClick={submit} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Отправить</button>
          {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
        </Card>
      </div>
    </div>
  );
}
