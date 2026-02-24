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

export type WorkflowDefinition = {
  trigger: {
    type: "schedule" | "metric_threshold" | "event";
    schedule?: "daily" | "weekly" | "monthly";
    metric?: string;
    operator?: ">" | "<" | "=";
    value?: number;
    event?: string;
  };
  conditions: Array<{
    type: "metric";
    metric: string;
    operator: ">" | "<" | "=";
    value: number;
    combinator?: "and" | "or";
  }>;
  actions: Array<{
    type: "notify" | "create_task" | "run_agent" | "integration";
    channel?: "telegram" | "email" | "panel";
    target?: string;
    integration?: string;
    description: string;
  }>;
};

export type Workflow = {
  id: string;
  workspaceId: string;
  name: string;
  status: "active" | "inactive";
  definition: WorkflowDefinition;
  lastRunAt: string;
};

export type WorkflowLog = {
  id: string;
  workflowId: string;
  status: "success" | "error";
  message: string;
  createdAt: string;
};

export type GoalTask = {
  id: string;
  title: string;
  integration: "bitrix24" | "amocrm" | "internal";
  status: "todo" | "in_progress" | "done";
};

export type Goal = {
  id: string;
  workspaceId: string;
  title: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  unit: "%" | "₽" | "шт" | "дн";
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "paused" | "achieved";
  requiredData: string[];
  missingData: string[];
  aiSummary: string;
  aiPlan: string[];
  tasks: GoalTask[];
  updatedAt: string;
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

export const workflows: Workflow[] = [
  {
    id: "wf1",
    workspaceId: "demo",
    name: "Риск кассового разрыва",
    status: "active",
    definition: {
      trigger: { type: "metric_threshold", metric: "cash_guard_days", operator: "<", value: 7 },
      conditions: [{ type: "metric", metric: "health_score", operator: "<", value: 70 }],
      actions: [
        { type: "notify", channel: "telegram", description: "Отправить предупреждение владельцу" },
        { type: "create_task", target: "owner", description: "Создать задачу: закрыть дебиторку" }
      ]
    },
    lastRunAt: now
  },
  {
    id: "wf2",
    workspaceId: "demo",
    name: "Падение ROMI в маркетинге",
    status: "inactive",
    definition: {
      trigger: { type: "metric_threshold", metric: "romi_total", operator: "<", value: 20 },
      conditions: [],
      actions: [{ type: "run_agent", description: "Запустить AI-агента маркетинга" }]
    },
    lastRunAt: now
  }
];

export const workflowLogs: WorkflowLog[] = [
  {
    id: "wfl1",
    workflowId: "wf1",
    status: "success",
    message: "Уведомление отправлено, задача создана в CRM.",
    createdAt: now
  }
];

export const goals: Goal[] = [
  {
    id: "g1",
    workspaceId: "demo",
    title: "Поднять ROMI до целевого уровня",
    targetMetric: "ROMI",
    targetValue: 120,
    currentValue: 51,
    unit: "%",
    deadline: "2026-04-30",
    priority: "high",
    status: "active",
    requiredData: ["Маркетинговые расходы", "Сделки CRM", "Выручка по каналам"],
    missingData: [],
    aiSummary: "Цель достижима за 6-8 недель при перераспределении бюджетов и запуске двух A/B тестов.",
    aiPlan: [
      "Отключить 2 убыточные кампании с ROMI ниже 0.",
      "Перенести 20% бюджета в канал с ROMI > 100.",
      "Запустить 2 эксперимента по офферу и креативам на сегмент SMB."
    ],
    tasks: [
      { id: "t1", title: "Отключить кампанию «Весенний оффер»", integration: "bitrix24", status: "todo" },
      { id: "t2", title: "Подготовить новый пакет креативов", integration: "internal", status: "in_progress" }
    ],
    updatedAt: now
  },
  {
    id: "g2",
    workspaceId: "demo",
    title: "Снизить риск кассового разрыва",
    targetMetric: "Дни до разрыва",
    targetValue: 0,
    currentValue: 5,
    unit: "дн",
    deadline: "2026-03-20",
    priority: "high",
    status: "active",
    requiredData: ["Платежный календарь", "Дебиторка", "План закупок"],
    missingData: ["Выписка банка за последние 60 дней"],
    aiSummary: "Есть риск кассового разрыва в течение недели. Нужна полная банковская выписка для точного плана.",
    aiPlan: [
      "Собрать просроченную дебиторку по 5 крупнейшим контрагентам.",
      "Перенести 2 исходящих платежа на следующую неделю.",
      "Подключить банковскую интеграцию для ежедневного прогноза."
    ],
    tasks: [
      { id: "t3", title: "Созвон с контрагентами по просрочке", integration: "amocrm", status: "todo" }
    ],
    updatedAt: now
  }
];
