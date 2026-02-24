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
  },
  {
    id: "w3",
    type: "marketing_romi_drop",
    level: "critical",
    message: "ROMI канала VK Реклама упал ниже 0% за последние 7 дней.",
    channel: "telegram",
    createdAt: new Date().toISOString()
  },
  {
    id: "w4",
    type: "marketing_cac_spike",
    level: "warning",
    message: "CAC кампании «Весенний оффер» вырос на 28% неделя к неделе.",
    channel: "dashboard",
    createdAt: new Date().toISOString()
  },
  {
    id: "w5",
    type: "creative_burnout",
    level: "warning",
    message: "Креатив «Скидка 15%» выгорел: CTR снизился на 41%.",
    channel: "dashboard",
    createdAt: new Date().toISOString()
  }
];

export const marketingChannels: MarketingChannel[] = [
  {
    name: "Яндекс.Директ",
    impressions: 420000,
    clicks: 16800,
    ctr: 4.0,
    leads: 740,
    deals: 186,
    spend: 680000,
    revenue: 2320000,
    margin: 39.5,
    cpl: 919,
    cac: 3656,
    romi: 142,
    roas: 3.41
  },
  {
    name: "VK Реклама",
    impressions: 510000,
    clicks: 15300,
    ctr: 3.0,
    leads: 510,
    deals: 92,
    spend: 590000,
    revenue: 470000,
    margin: 24.2,
    cpl: 1157,
    cac: 6413,
    romi: -21,
    roas: 0.8
  },
  {
    name: "Telegram Ads",
    impressions: 300000,
    clicks: 12300,
    ctr: 4.1,
    leads: 430,
    deals: 117,
    spend: 310000,
    revenue: 980000,
    margin: 33.8,
    cpl: 721,
    cac: 2649,
    romi: 94,
    roas: 3.16
  },
  {
    name: "myTarget",
    impressions: 220000,
    clicks: 6600,
    ctr: 3.0,
    leads: 230,
    deals: 44,
    spend: 210000,
    revenue: 160000,
    margin: 18.9,
    cpl: 913,
    cac: 4773,
    romi: -12,
    roas: 0.76
  }
];

export const marketingCampaigns: MarketingCampaign[] = [
  { id: "mc1", channel: "Яндекс.Директ", name: "Поиск бренд + конкуренты", status: "active", spend: 240000, leads: 312, deals: 79, revenue: 920000, romi: 131, cac: 3038, aiDecision: "Масштабировать" },
  { id: "mc2", channel: "VK Реклама", name: "Весенний оффер", status: "active", spend: 210000, leads: 146, deals: 21, revenue: 120000, romi: -44, cac: 10000, aiDecision: "Отключить" },
  { id: "mc3", channel: "Telegram Ads", name: "Лид-магнит B2B", status: "paused", spend: 98000, leads: 132, deals: 31, revenue: 360000, romi: 108, cac: 3161, aiDecision: "Оптимизировать" },
  { id: "mc4", channel: "myTarget", name: "Ретаргетинг каталог", status: "archived", spend: 64000, leads: 45, deals: 7, revenue: 42000, romi: -34, cac: 9142, aiDecision: "Отключить" }
];

export const marketingExperiments: MarketingExperiment[] = [
  {
    id: "ex1",
    name: "Новый оффер для сегмента SMB",
    hypothesis: "Сокращенный оффер повысит конверсию в заявку",
    metric: "Конверсия в лид",
    status: "Победитель выбран",
    winner: "B",
    a: { ctr: 2.9, conversion: 4.8, romi: 56 },
    b: { ctr: 3.8, conversion: 6.1, romi: 88 }
  },
  {
    id: "ex2",
    name: "Креативы с кейсами",
    hypothesis: "Кейсы клиентов дадут выше CTR в Telegram",
    metric: "CTR",
    status: "Идет",
    winner: "Нет",
    a: { ctr: 3.3, conversion: 5.1, romi: 72 },
    b: { ctr: 3.5, conversion: 4.9, romi: 69 }
  }
];

export const marketingCreatives: MarketingCreative[] = [
  { id: "cr1", title: "Сократили расходы на 18% за 30 дней", channel: "Яндекс.Директ", format: "Баннер", ctr: 4.5, conversion: 6.2, romi: 132, best: true },
  { id: "cr2", title: "Кассовый контроль без Excel", channel: "Telegram Ads", format: "Текст", ctr: 4.1, conversion: 5.5, romi: 104, best: true },
  { id: "cr3", title: "Сводка собственника каждое утро", channel: "VK Реклама", format: "Сторис", ctr: 2.2, conversion: 2.7, romi: -9, best: false },
  { id: "cr4", title: "AI-советник для бизнеса", channel: "myTarget", format: "Баннер", ctr: 2.0, conversion: 2.1, romi: -15, best: false }
];

export const marketingSources: MarketingSource[] = [
  { id: "ms1", name: "Яндекс.Директ", status: "connected", lastSync: "3 мин назад" },
  { id: "ms2", name: "VK Реклама", status: "connected", lastSync: "6 мин назад" },
  { id: "ms3", name: "Telegram Ads", status: "needs_refresh", lastSync: "вчера 22:17" },
  { id: "ms4", name: "myTarget", status: "error", lastSync: "ошибка синка" }
];

export const integrations: IntegrationItem[] = [
  { id: "i1", type: "bitrix24", status: "active", lastSync: "5 мин назад" },
  { id: "i2", type: "yandex_direct", status: "active", lastSync: "12 мин назад" },
  { id: "i3", type: "vk_ads", status: "draft", lastSync: "не запускался" }
];

export const integrationRules: IntegrationRule[] = [
  { id: "r1", when: "Если конверсия < 8%", then: "То создать задачу в CRM на разбор воронки продаж", enabled: true },
  { id: "r2", when: "Если просрочка платежа > 3 дней", then: "То отправить напоминание в Telegram и SMS", enabled: true }
];

export const learnFaq = [
  {
    q: "Как подключить данные?",
    a: "Откройте «Источники данных», вставьте ссылку Google Sheets или загрузите CSV/Excel."
  },
  {
    q: "Как работает AI-советник?",
    a: "AI-советник использует KPI, юнит-экономику, прогноз денег и историю сессий для структурированных рекомендаций."
  },
  {
    q: "Что такое Режим владельца?",
    a: "Это экран собственника: индекс здоровья бизнеса, главная проблема недели и фокус дня."
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

export function buildMarketingOverview() {
  const spend = marketingChannels.reduce((acc, item) => acc + item.spend, 0);
  const revenue = marketingChannels.reduce((acc, item) => acc + item.revenue, 0);
  const avgRomi = marketingChannels.reduce((acc, item) => acc + item.romi, 0) / marketingChannels.length;
  const avgCac = marketingChannels.reduce((acc, item) => acc + item.cac, 0) / marketingChannels.length;
  const index = clamp(65 + avgRomi * 0.18 - (avgCac / 1000) * 2.2, 0, 100);

  const sortedByRomi = [...marketingChannels].sort((a, b) => b.romi - a.romi);
  const top = sortedByRomi.slice(0, 3).map((item) => ({ name: item.name, romi: item.romi }));
  const worst = [...sortedByRomi].reverse().slice(0, 3).map((item) => ({ name: item.name, romi: item.romi }));

  return {
    index: Math.round(index),
    period: "30 дней",
    spend,
    revenue,
    romi: Number(avgRomi.toFixed(1)),
    cac: Math.round(avgCac),
    topChannels: top,
    problemChannels: worst,
    recommendations: [
      "Сократить бюджет в VK Реклама до стабилизации CAC.",
      "Усилить Яндекс.Директ на 15% при сохранении текущего ROMI.",
      "Запустить новый A/B тест оффера для Telegram Ads."
    ]
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
