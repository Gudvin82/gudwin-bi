export type MetricCatalogItem = {
  id: string;
  label: string;
  group: string;
  unit?: string;
  description: string;
  defaultViz: "kpi" | "line" | "bar" | "table";
};

export const metricCatalog: MetricCatalogItem[] = [
  { id: "revenue", label: "Выручка", group: "Финансы", unit: "₽", description: "Общая выручка за выбранный период.", defaultViz: "line" },
  { id: "profit", label: "Прибыль", group: "Финансы", unit: "₽", description: "Чистая прибыль после расходов.", defaultViz: "line" },
  { id: "margin", label: "Маржа", group: "Финансы", unit: "%", description: "Доля маржи в выручке.", defaultViz: "kpi" },
  { id: "cash_balance", label: "Остаток денег", group: "Финансы", unit: "₽", description: "Текущий остаток денег на счетах.", defaultViz: "kpi" },
  { id: "cash_guard_min", label: "Минимальный остаток (Cash Guard)", group: "Финансы", unit: "₽", description: "Минимальный прогноз по кассе на период.", defaultViz: "line" },
  { id: "receivables", label: "Дебиторка", group: "Финансы", unit: "₽", description: "Сумма просроченной дебиторской задолженности.", defaultViz: "bar" },
  { id: "payables", label: "Кредиторка", group: "Финансы", unit: "₽", description: "Сумма обязательств перед поставщиками.", defaultViz: "bar" },
  { id: "romi", label: "ROMI", group: "Маркетинг", unit: "%", description: "Окупаемость маркетинга.", defaultViz: "kpi" },
  { id: "cac", label: "CAC", group: "Маркетинг", unit: "₽", description: "Стоимость привлечения клиента.", defaultViz: "kpi" },
  { id: "ltv", label: "LTV", group: "Маркетинг", unit: "₽", description: "Пожизненная ценность клиента.", defaultViz: "kpi" },
  { id: "ltv_cac", label: "LTV/CAC", group: "Маркетинг", unit: "x", description: "Соотношение ценности и стоимости привлечения.", defaultViz: "kpi" },
  { id: "leads", label: "Лиды", group: "Продажи", unit: "шт", description: "Количество лидов за период.", defaultViz: "line" },
  { id: "deals", label: "Сделки", group: "Продажи", unit: "шт", description: "Количество закрытых сделок.", defaultViz: "line" },
  { id: "conversion", label: "Конверсия", group: "Продажи", unit: "%", description: "Конверсия из лидов в сделки.", defaultViz: "line" },
  { id: "avg_check", label: "Средний чек", group: "Продажи", unit: "₽", description: "Средний чек по сделкам.", defaultViz: "line" },
  { id: "traffic", label: "Трафик", group: "Маркетинг", unit: "посещ.", description: "Посещаемость по каналам.", defaultViz: "line" },
  { id: "ctr", label: "CTR", group: "Маркетинг", unit: "%", description: "Кликабельность рекламных объявлений.", defaultViz: "line" },
  { id: "cpl", label: "CPL", group: "Маркетинг", unit: "₽", description: "Стоимость лида.", defaultViz: "kpi" },
  { id: "health_score", label: "Health Score", group: "Управление", unit: "балл", description: "Композитный индекс здоровья бизнеса.", defaultViz: "kpi" },
  { id: "risk_score", label: "Индекс риска", group: "Управление", unit: "балл", description: "Оценка текущих рисков бизнеса.", defaultViz: "kpi" }
];

export const metricGroups = Array.from(new Set(metricCatalog.map((item) => item.group)));

export type FilterField = {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
};

export const filterFields: FilterField[] = [
  { id: "period", label: "Период", type: "select", options: ["7 дней", "30 дней", "90 дней", "12 месяцев", "Свой период"] },
  { id: "channel", label: "Канал", type: "text" },
  { id: "product", label: "Продукт/услуга", type: "text" },
  { id: "manager", label: "Менеджер", type: "text" },
  { id: "region", label: "Регион", type: "text" },
  { id: "segment", label: "Сегмент", type: "text" },
  { id: "client", label: "Клиент", type: "text" }
];

export const filterOperators = ["=", "≠", ">", "<", "≥", "≤", "между", "содержит"];
