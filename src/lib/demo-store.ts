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

export type CalendarEvent = {
  id: string;
  workspaceId: string;
  title: string;
  date: string;
  time: string;
  durationMin: number;
  assignee: string;
  source: "manual" | "bitrix24" | "amocrm" | "google_calendar";
  status: "planned" | "done" | "canceled";
  notifyTelegram: boolean;
  createCrmTask: boolean;
  notes?: string;
};

export type CalendarActionLog = {
  id: string;
  eventId: string;
  type: "telegram" | "crm_task";
  message: string;
  createdAt: string;
};

export type TelegramConfig = {
  id: string;
  workspaceId: string;
  botName?: string;
  tokenMasked: string;
  chatId: string;
  groups?: string[];
  createdAt: string;
  status: "connected" | "needs_attention";
};

export type YandexDirectConfig = {
  id: string;
  workspaceId: string;
  login: string;
  clientId: string;
  tokenMasked: string;
  createdAt: string;
  status: "connected" | "needs_refresh";
};

const now = new Date().toISOString();

export const advisorSessions: AdvisorSession[] = [];

export const advisorMessages: AdvisorMessage[] = [];

export const agents: AgentItem[] = [];

export const agentLogs: AgentLog[] = [];

export const hireRequests: HireRequest[] = [];

export const telegramConfigs: TelegramConfig[] = [];
export const yandexDirectConfigs: YandexDirectConfig[] = [];

export const workflows: Workflow[] = [];

export const workflowLogs: WorkflowLog[] = [];

export const goals: Goal[] = [];

export const calendarEvents: CalendarEvent[] = [];

export const calendarActionLogs: CalendarActionLog[] = [];
