export type AdvisorRole = "business" | "accountant" | "financier";

export type AdvisorSession = {
  id: string;
  workspaceId: string;
  role: AdvisorRole;
  title: string;
  createdAt: string;
};

export type AdvisorMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  structured?: {
    summary: string;
    insights: string[];
    recommendations: string[];
    risk_flags: string[];
  };
  createdAt: string;
};

export type AgentItem = {
  id: string;
  workspaceId: string;
  type: "support" | "hr" | "sales" | "marketing" | "custom";
  name: string;
  description: string;
  status: "active" | "paused";
  config_json: Record<string, unknown>;
  createdAt: string;
};

export type AgentLog = {
  id: string;
  agentId: string;
  timestamp: string;
  eventType: string;
  message: string;
  metadata_json: Record<string, unknown>;
};

export type HireRequest = {
  id: string;
  workspaceId: string;
  role_type: string;
  raw_description: string;
  ai_generated_brief: string;
  status: "draft" | "ready" | "published";
  createdAt: string;
};

const now = new Date().toISOString();

export const advisorSessions: AdvisorSession[] = [
  { id: "s1", workspaceId: "demo", role: "business", title: "Рост маржи Q1", createdAt: now },
  { id: "s2", workspaceId: "demo", role: "financier", title: "Cash flow на 90 дней", createdAt: now }
];

export const advisorMessages: AdvisorMessage[] = [
  {
    id: "m1",
    sessionId: "s1",
    role: "assistant",
    content: "Снижение маржи связано с ростом переменных расходов в маркетплейсе.",
    structured: {
      summary: "Маржа просела на 3.4 п.п. из-за роста комиссии каналов и скидок.",
      insights: [
        "Комиссия маркетплейса выросла на 18% при неизменном среднем чеке.",
        "Доля промо-заказов выросла до 42%, что съедает прибыльность."
      ],
      recommendations: [
        "Пересмотреть промо-механику для SKU с низкой маржой (приоритет: высокий).",
        "Перенести 15% бюджета в канал с лучшим ROMI."
      ],
      risk_flags: ["Если тренд сохранится, EBITDA может упасть еще на 5-7% в следующем квартале."]
    },
    createdAt: now
  }
];

export const agents: AgentItem[] = [
  {
    id: "a1",
    workspaceId: "demo",
    type: "support",
    name: "Агент поддержки",
    description: "Анализирует обращения и SLA, формирует ежедневный отчет.",
    status: "active",
    config_json: { schedule: "daily 09:00", sources: ["tickets", "telegram"] },
    createdAt: now
  },
  {
    id: "a2",
    workspaceId: "demo",
    type: "sales",
    name: "Агент продаж",
    description: "Ищет потерянные лиды и формирует follow-up список.",
    status: "active",
    config_json: { schedule: "daily 10:00", sources: ["crm_deals"] },
    createdAt: now
  }
];

export const agentLogs: AgentLog[] = [
  {
    id: "l1",
    agentId: "a1",
    timestamp: now,
    eventType: "daily_report",
    message: "Обнаружены 12 обращений с риском нарушения SLA.",
    metadata_json: { severity: "high" }
  },
  {
    id: "l2",
    agentId: "a2",
    timestamp: now,
    eventType: "lead_scan",
    message: "Найдено 18 сделок без активности более 5 дней.",
    metadata_json: { staleDeals: 18 }
  }
];

export const hireRequests: HireRequest[] = [];
