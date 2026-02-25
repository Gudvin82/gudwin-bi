"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Mic, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const sectionMap: Record<string, { name: string; href: string }> = {
  owner: { name: "Режим владельца", href: "/owner" },
  overview: { name: "Главная панель", href: "/overview" },
  finance: { name: "Финансы", href: "/finance" },
  marketing: { name: "Маркетинг", href: "/marketing" },
  analytics: { name: "Аналитика", href: "/analytics" },
  dashboards: { name: "Дашборды", href: "/dashboards" },
  advisor: { name: "ИИ-советник", href: "/advisor" },
  watch: { name: "Мониторинг", href: "/watch" },
  goals: { name: "Цели", href: "/goals" },
  automation: { name: "Сценарии и агенты", href: "/automation" },
  calendar: { name: "Календарь", href: "/calendar" },
  sources: { name: "Источники данных", href: "/sources" },
  settings: { name: "Настройки", href: "/settings" },
  integrations: { name: "Интеграции", href: "/integrations" },
  docs: { name: "Юр отдел", href: "/docs" },
  team: { name: "Команда", href: "/team" }
};

export function GlobalAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "owner";
  const section = sectionMap[firstSegment] ?? sectionMap.owner;

  const msgIdRef = useRef(0);
  const nextId = () => {
    msgIdRef.current += 1;
    return `msg-${msgIdRef.current}`;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-initial",
      role: "assistant",
      text: `Я ваш личный ИИ-помощник в разделе «${section.name}». Скажите, что нужно сделать, и я помогу сразу.`
    }
  ]);

  const hintCommands = useMemo(
    () => [
      "Открой финансы",
      "Открой цели",
      "Открой сценарии",
      "Открой календарь",
      "Перейди в маркетинг",
      "Собери тройной отчет",
      "Помоги по текущему разделу"
    ],
    []
  );

  const pushMessage = (message: Message) => setMessages((prev) => [...prev, message]);

  useEffect(() => {
    setMessages([
      {
        id: "msg-initial",
        role: "assistant",
        text: `Я ваш личный ИИ-помощник в разделе «${section.name}». Скажите, что нужно сделать, и я помогу сразу.`
      }
    ]);
  }, [section.name]);

  const navigateByText = (text: string) => {
    const normalized = text.toLowerCase();
    const pairs = Object.values(sectionMap);
    const hit = pairs.find((item) => normalized.includes(item.name.toLowerCase().split(" ")[0]));
    if (hit) {
      router.push(hit.href);
      return `Перехожу в раздел «${hit.name}».`;
    }
    return null;
  };

  const runCommand = (text: string) => {
    const normalized = text.toLowerCase();

    if (normalized.includes("тройной отчет") || normalized.includes("тройной отч")) {
      router.push("/analytics/report-builder");
      return "Открываю конструктор отчётов. Рекомендую набор: финансы + маркетинг + мониторинг, период 30 дней.";
    }

    if (normalized.includes("цель") || normalized.includes("цели")) {
      router.push("/goals");
      return "Открываю раздел «Цели». Там можно задать целевые метрики и получить ИИ-план достижения.";
    }

    if (normalized.includes("сценар") || normalized.includes("автоматизац")) {
      router.push("/automation");
      return "Открываю раздел «Сценарии и агенты». Соберём правило из кубиков: когда → если → сделать.";
    }

    if (normalized.includes("календар")) {
      router.push("/calendar");
      return "Открываю календарь. Там можно запланировать встречи, отправить уведомление в Telegram и создать задачу в CRM.";
    }

    if (normalized.includes("дашборд")) {
      router.push("/dashboards/builder");
      return "Открываю конструктор дашбордов. Можно собрать сводный экран по финансам, маркетингу и рискам.";
    }

    if (normalized.includes("помоги") || normalized.includes("что здесь")) {
      return `В разделе «${section.name}» я могу: 1) открыть нужный подраздел, 2) помочь собрать отчёт, 3) предложить следующий шаг по вашим данным.`;
    }

    const navResult = navigateByText(text);
    if (navResult) return navResult;

    return "Принял команду. Могу открыть раздел, собрать отчёт, перейти в конструктор дашбордов или подсказать следующий шаг.";
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    pushMessage({ id: nextId(), role: "user", text: trimmed });
    const answer = runCommand(trimmed);
    pushMessage({ id: nextId(), role: "assistant", text: answer });
    setInput("");
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => { [key: string]: unknown }; webkitSpeechRecognition?: new () => { [key: string]: unknown } })
        .SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => { [key: string]: unknown } }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      pushMessage({
        id: nextId(),
        role: "assistant",
        text: "Голосовой ввод не поддерживается в этом браузере. Используйте текстовый ввод."
      });
      return;
    }

    const recognition = new SpeechRecognition() as {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: (event: { results?: Array<Array<{ transcript?: string }>> }) => void;
      start: () => void;
    };
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: { results?: Array<Array<{ transcript?: string }>> }) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (!transcript.trim()) return;
      setInput(transcript);
      pushMessage({ id: nextId(), role: "user", text: transcript });
      const answer = runCommand(transcript);
      pushMessage({ id: nextId(), role: "assistant", text: answer });
      setInput("");
    };
    recognition.start();
  };

  return (
    <div className="fixed bottom-24 right-3 z-[80] pointer-events-auto md:bottom-6 md:right-6">
      {isOpen ? (
        <div className="w-[min(92vw,390px)] rounded-3xl border border-cyan-100/80 bg-[linear-gradient(145deg,_rgba(255,255,255,0.97),_rgba(240,249,255,0.94))] p-3 shadow-[0_18px_50px_rgba(8,145,178,0.25)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Умный помощник</p>
              <p className="text-xs text-slate-500">Раздел: {section.name}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
              Свернуть
            </button>
          </div>

          <div className="mb-2 rounded-2xl border border-cyan-100 bg-white/85 px-3 py-2 text-xs text-cyan-900">
            Я ваш личный помощник во всех разделах. Напишите или продиктуйте задачу — помогу с навигацией, отчётом и действиями.
          </div>

          <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-2.5 py-2 text-xs ${
                  message.role === "user"
                    ? "ml-auto max-w-[85%] bg-cyan-600 text-white"
                    : "mr-auto max-w-[90%] border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {hintCommands.map((hint) => (
              <button key={hint} onClick={() => setInput(hint)} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50">
                {hint}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") send();
              }}
              className="w-full rounded-xl border border-slate-200 p-2 text-sm"
              placeholder="Например: собери тройной отчет"
            />
            <button onClick={startVoice} aria-label="Голосовой ввод" className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <Mic size={16} />
            </button>
            <button onClick={send} aria-label="Отправить команду" className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 p-2 text-white shadow-sm">
              <Send size={16} />
            </button>
          </div>

          <div className="mt-2 text-[11px] text-slate-500">
            Быстрый переход: <Link href={section.href} className="font-semibold text-cyan-700 underline">{section.name}</Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-cyan-300/60 bg-[radial-gradient(circle_at_20%_20%,_rgba(125,211,252,0.95),_rgba(8,145,178,0.96)_45%,_rgba(15,118,110,0.96))] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(8,145,178,0.35)]"
        >
          <Sparkles size={16} />
          Помощник
          <span className="hidden text-[10px] font-medium opacity-90 sm:inline group-hover:opacity-100">Спросите, что сделать</span>
        </button>
      )}
    </div>
  );
}
