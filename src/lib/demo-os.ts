export type UnitMetric = {
  dimension: string;
  cac: number;
  ltv: number;
  contribution_margin: number;
  romi: number;
  payback_days: number;
};

export type CashDay = {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
};

export type Leak = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  impact: string;
  recommendation: string;
};

export type WatchAlert = {
  id: string;
  type: "anomaly" | "cash_risk" | "kpi_drop" | "client_risk" | "marketing_romi_drop" | "marketing_cac_spike" | "creative_burnout";
  level: "critical" | "warning" | "info";
  message: string;
  channel: "telegram" | "sms" | "dashboard";
  createdAt: string;
};

export type PaymentItem = {
  id: string;
  date: string;
  type: "incoming" | "outgoing";
  counterparty: string;
  amount: number;
  status: "planned" | "paid" | "overdue";
};

export type IntegrationItem = {
  id: string;
  type: string;
  status: "active" | "error" | "draft";
  lastSync: string;
};

export type IntegrationRule = {
  id: string;
  when: string;
  then: string;
  enabled: boolean;
};

export type DevRequest = {
  id: string;
  name: string;
  contact: string;
  message: string;
  createdAt: string;
};

export type DecisionLogItem = {
  id: string;
  workspaceId: string;
  sessionId: string;
  recommendation: string;
  status: "accepted" | "rejected" | "in_progress";
  effect_note?: string;
  createdAt: string;
};

export type MarketingChannel = {
  name: string;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  deals: number;
  spend: number;
  revenue: number;
  margin: number;
  cpl: number;
  cac: number;
  romi: number;
  roas: number;
};

export type MarketingCampaign = {
  id: string;
  channel: string;
  name: string;
  status: "active" | "paused" | "archived";
  spend: number;
  leads: number;
  deals: number;
  revenue: number;
  romi: number;
  cac: number;
  aiDecision: "Отключить" | "Оптимизировать" | "Масштабировать";
};

export type MarketingExperiment = {
  id: string;
  name: string;
  hypothesis: string;
  metric: string;
  status: "Идет" | "Завершен" | "Победитель выбран";
  winner: "A" | "B" | "Нет";
  a: { ctr: number; conversion: number; romi: number };
  b: { ctr: number; conversion: number; romi: number };
};

export type MarketingCreative = {
  id: string;
  title: string;
  channel: string;
  format: string;
  ctr: number;
  conversion: number;
  romi: number;
  best: boolean;
};

export type MarketingSource = {
  id: string;
  name: string;
  status: "connected" | "needs_refresh" | "error";
  lastSync: string;
};

const now = new Date();

export const unitMetrics: UnitMetric[] = [];

export const paymentCalendar: PaymentItem[] = [];

export const moneyLeaks: Leak[] = [];

export const watchAlerts: WatchAlert[] = [];

export const marketingChannels: MarketingChannel[] = [];

export const marketingCampaigns: MarketingCampaign[] = [];

export const marketingExperiments: MarketingExperiment[] = [];

export const marketingCreatives: MarketingCreative[] = [];

export const marketingSources: MarketingSource[] = [];

export const integrations: IntegrationItem[] = [];

export const integrationRules: IntegrationRule[] = [];

export const learnFaq = [
  {
    q: "Как подключить данные?",
    a: "Откройте «Источники данных», вставьте ссылку Google Таблиц или загрузите CSV/Excel."
  },
  {
    q: "Как работает ИИ-советник?",
    a: "ИИ-советник использует KPI, юнит-экономику, прогноз денег и историю сессий для структурированных рекомендаций."
  },
  {
    q: "Что такое Режим владельца?",
    a: "Это экран собственника: индекс здоровья бизнеса, главная проблема недели и фокус дня."
  }
];

export const competitorSignals: Array<{ competitor: string; signal: string; action: string }> = [];

export const devRequests: DevRequest[] = [];

export const decisionLog: DecisionLogItem[] = [];

export function buildCashForecast(_days = 30) {
  return [] as CashDay[];
}

export function computeHealthScore() {
  if (unitMetrics.length === 0 && moneyLeaks.length === 0 && watchAlerts.length === 0) {
    return {
      score: 0,
      components: {
        financial: 0,
        cash: 0,
        operations: 0,
        riskPenalty: 0
      }
    };
  }

  const avgRomi = unitMetrics.reduce((acc, item) => acc + item.romi, 0) / unitMetrics.length;
  const avgLtvCac = unitMetrics.reduce((acc, item) => acc + item.ltv / item.cac, 0) / unitMetrics.length;
  const cashForecast = buildCashForecast();
  const minBalance = cashForecast.length ? Math.min(...cashForecast.map((d) => d.balance)) : 0;

  const financial = clamp(55 + (avgLtvCac - 1.5) * 15 + (avgRomi - 100) * 0.05, 0, 100);
  const cash = clamp(50 + (minBalance > 0 ? 25 : -20), 0, 100);
  const operations = clamp(72 - moneyLeaks.length * 7, 0, 100);
  const riskPenalty = watchAlerts.filter((a) => a.level === "critical").length * 8;

  const score = clamp((financial * 0.35 + cash * 0.35 + operations * 0.3) - riskPenalty, 0, 100);

  return {
    score: Math.round(score),
    components: {
      financial: Math.round(financial),
      cash: Math.round(cash),
      operations: Math.round(operations),
      riskPenalty
    }
  };
}

export function buildRevenueForecast(_months = 6) {
  return [];
}

export function simulateScenario(_input?: unknown) {
  return {
    baselineProfit: 0,
    projectedProfit: 0,
    deltaPct: 0,
    romiProjected: 0,
    cashflowProjected: 0,
    explanation: "Недостаточно данных для сценарного моделирования."
  };
}

export function buildMarketingOverview() {
  if (!marketingChannels.length) {
    return {
      index: 0,
      period: "—",
      spend: 0,
      revenue: 0,
      romi: 0,
      cac: 0,
      topChannels: [],
      problemChannels: [],
      recommendations: []
    };
  }

  const spend = marketingChannels.reduce((acc, item) => acc + item.spend, 0);
  const revenue = marketingChannels.reduce((acc, item) => acc + item.revenue, 0);
  const avgRomi = marketingChannels.reduce((acc, item) => acc + item.romi, 0) / marketingChannels.length;
  const avgCac = marketingChannels.reduce((acc, item) => acc + item.cac, 0) / marketingChannels.length;
  const index = clamp(65 + avgRomi * 0.18 - (avgCac / 1000) * 2.2, 0, 100);

  const sortedByRomi = [...marketingChannels].sort((a, b) => b.romi - a.romi);
  const top = sortedByRomi.slice(0, 3).map((item) => ({ name: item.name, romi: item.romi }));
  const clearProblemChannels = marketingChannels
    .filter((item) => item.romi < 25)
    .sort((a, b) => a.romi - b.romi)
    .map((item) => ({ name: item.name, romi: item.romi }));
  const worst = (clearProblemChannels.length ? clearProblemChannels : [...sortedByRomi].reverse().slice(0, 2));

  return {
    index: Math.round(index),
    period: "30 дней",
    spend,
    revenue,
    romi: Number(avgRomi.toFixed(1)),
    cac: Math.round(avgCac),
    topChannels: top,
    problemChannels: worst,
    recommendations: []
  };
}

function nextDate(offset: number) {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
