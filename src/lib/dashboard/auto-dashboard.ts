export type DatasetSchema = Array<{ name: string; type: string }>;

export function proposeDashboard(schema: DatasetSchema) {
  const hasRevenue = schema.some((col) => /revenue|amount|sum|выруч/i.test(col.name));
  const hasDate = schema.some((col) => /date|time|period|дата/i.test(col.name));

  return {
    name: "Автодашборд",
    widgets: [
      {
        type: "metric",
        config: { title: "Общий объём", aggregate: hasRevenue ? "sum(revenue)" : "count(*)" },
        position: { x: 0, y: 0, w: 4, h: 2 }
      },
      {
        type: hasDate ? "chart_line" : "table",
        config: {
          title: hasDate ? "Динамика" : "Последние записи",
          queryHint: hasDate ? "group by month" : "limit 20"
        },
        position: { x: 4, y: 0, w: 8, h: 4 }
      }
    ]
  };
}
