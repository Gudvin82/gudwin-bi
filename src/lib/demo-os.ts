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
  type: "anomaly" | "cash_risk" | "kpi_drop" | "client_risk";
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

const now = new Date();

export const unitMetrics: UnitMetric[] = [
  { dimension: "Онлайн-магазин", cac: 1800, ltv: 7600, contribution_margin: 41.2, romi: 186, payback_days: 49 },
  { dimension: "Маркетплейс", cac: 2400, ltv: 5400, contribution_margin: 24.5, romi: 94, payback_days: 82 },
  { dimension: "Розница", cac: 900, ltv: 4200, contribution_margin: 36.1, romi: 210, payback_days: 35 }
];

export const paymentCalendar: PaymentItem[] = [
  { id: "p1", date: nextDate(1), type: "incoming", counterparty: "ООО Альфа", amount: 220000, status: "planned" },
  { id: "p2", date: nextDate(2), type: "outgoing", counterparty: "Аренда", amount: 160000, status: "planned" },
  { id: "p3", date: nextDate(4), type: "outgoing", counterparty: "ФОТ", amount: 540000, status: "planned" },
  { id: "p4", date: nextDate(6), type: "incoming", counterparty: "ИП Смирнов", amount: 140000, status: "overdue" },
  { id: "p5", date: nextDate(7), type: "outgoing", counterparty: "Налоги", amount: 210000, status: "planned" }
];

export const moneyLeaks: Leak[] = [
  {
    id: "l1",
    title: "Канал marketplace с отрицательным ROMI в 2 кампаниях",
    severity: "high",
    impact: "-148 000 ₽ / мес",
    recommendation: "Отключить 2 кампании с ROMI < 0, перераспределить бюджет в retargeting."
  },
  {
    id: "l2",
    title: "SKU A17 продается с маржой ниже 8%",
    severity: "medium",
    impact: "-62 000 ₽ / мес",
    recommendation: "Повысить цену на 6% или заменить поставщика."
  },
  {
    id: "l3",
    title: "Группа лидов без follow-up > 5 дней",
    severity: "medium",
    impact: "Потеря 11-15 сделок/мес",
    recommendation: "Передать в Sales Agent, включить автозадачу в CRM."
  }
];

export const watchAlerts: WatchAlert[] = [
  {
    id: "w1",
    type: "cash_risk",
    level: "critical",
    message: "Прогноз остатка на 2026-03-03 ниже 0: риск кассового разрыва.",
    channel: "telegram",
    createdAt: new Date().toISOString()
  },
  {
    id: "w2",
    type: "kpi_drop",
    level: "warning",
    message: "Конверсия отдела продаж снизилась на 14% неделя к неделе.",
    channel: "dashboard",
    createdAt: new Date().toISOString()
  }
];

export const integrations: IntegrationItem[] = [
  { id: "i1", type: "bitrix24", status: "active", lastSync: "5 мин назад" },
  { id: "i2", type: "yandex_direct", status: "active", lastSync: "12 мин назад" },
  { id: "i3", type: "vk_ads", status: "draft", lastSync: "не запускался" }
];

export const integrationRules: IntegrationRule[] = [
  { id: "r1", when: "IF conversion < 8%", then: "THEN create CRM task for sales lead review", enabled: true },
  { id: "r2", when: "IF payment overdue > 3 days", then: "THEN send Telegram reminder + SMS", enabled: true }
];

export const learnFaq = [
  {
    q: "Как подключить данные?",
    a: "Откройте «Источники данных», вставьте ссылку Google Sheets или загрузите CSV/Excel."
  },
  {
    q: "Как работает Smart Advisor?",
    a: "Advisor использует KPI, unit economics, cash guard и историю сессий для структурированных рекомендаций."
  },
  {
    q: "Что такое Owner Mode?",
    a: "Это экран собственника: Health Score, главная проблема недели и фокус дня."
  }
];

export const competitorSignals = [
  { competitor: "Конкурент A", signal: "Снизил цену на флагман SKU на 9%", action: "Проверить эластичность цены и запустить бандл" },
  { competitor: "Конкурент B", signal: "Запустил промо 2+1", action: "Сделать ограниченную акцию на high-margin товары" },
  { competitor: "Конкурент C", signal: "Рост негативных отзывов по доставке", action: "Усилить коммуникацию SLA в рекламе" }
];

export const devRequests: DevRequest[] = [];

export const decisionLog: DecisionLogItem[] = [];

export function buildCashForecast(days = 30, openingBalance = 420000) {
  const rows: CashDay[] = [];
  let balance = openingBalance;

  for (let i = 0; i < days; i += 1) {
    const date = nextDate(i);
    const inflow = i % 5 === 0 ? 260000 : 110000 + (i % 3) * 15000;
    const outflow = i % 7 === 0 ? 340000 : 130000 + (i % 4) * 14000;
    balance += inflow - outflow;
    rows.push({ date, inflow, outflow, balance });
  }

  return rows;
}

export function computeHealthScore() {
  const avgRomi = unitMetrics.reduce((acc, item) => acc + item.romi, 0) / unitMetrics.length;
  const avgLtvCac = unitMetrics.reduce((acc, item) => acc + item.ltv / item.cac, 0) / unitMetrics.length;
  const cashForecast = buildCashForecast(30);
  const minBalance = Math.min(...cashForecast.map((d) => d.balance));

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

export function buildRevenueForecast(months = 6) {
  const base = [3.95, 4.12, 4.08, 4.24, 4.38, 4.56];
  return Array.from({ length: months }, (_, idx) => ({
    month: `M${idx + 1}`,
    revenue_mln: Number((base[idx] ?? (base[base.length - 1] * (1 + idx * 0.02))).toFixed(2))
  }));
}

export function simulateScenario(input: { priceDeltaPct: number; adBudgetDeltaPct: number; managerDelta: number; discountDeltaPct: number }) {
  const baselineProfit = 820000;
  const profitImpact = baselineProfit * (input.priceDeltaPct * 0.9 + input.adBudgetDeltaPct * 0.35 - input.discountDeltaPct * 0.7) / 100 + input.managerDelta * 38000;
  const projectedProfit = baselineProfit + profitImpact;

  return {
    baselineProfit,
    projectedProfit: Math.round(projectedProfit),
    deltaPct: Number((((projectedProfit - baselineProfit) / baselineProfit) * 100).toFixed(1)),
    romiProjected: Number((132 + input.adBudgetDeltaPct * 0.5 - input.discountDeltaPct * 0.4).toFixed(1)),
    cashflowProjected: Math.round(1180000 + profitImpact * 1.4),
    explanation: "Сценарий учитывает изменение маржи, рекламной эффективности и нагрузки команды продаж."
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
