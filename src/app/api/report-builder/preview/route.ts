import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  dataset: z.enum(["sales", "marketing", "finance"]).default("sales"),
  period: z.enum(["7d", "30d", "90d", "365d"]).default("30d"),
  groupBy: z.enum(["day", "week", "month", "channel", "product", "manager"]).default("month"),
  metrics: z.array(z.enum(["revenue", "spend", "profit", "leads", "deals", "avg_check", "conversion", "romi"])).min(1).max(6)
});

type RecordRow = {
  date: Date;
  channel: string;
  product: string;
  manager: string;
  leads: number;
  deals: number;
  revenue: number;
  spend: number;
};

const channels = ["VK", "Telegram", "Яндекс", "SEO"];
const products = ["Базовый", "Премиум", "Подписка"];
const managers = ["Ирина", "Максим", "Анна"];

function generateRows(days: number): RecordRow[] {
  const rows: RecordRow[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    for (let c = 0; c < channels.length; c += 1) {
      const leads = 24 + ((i + c * 7) % 40);
      const deals = Math.max(3, Math.round(leads * (0.12 + c * 0.01)));
      const avgCheck = 2900 + c * 380 + (i % 6) * 40;
      const revenue = deals * avgCheck;
      const spend = Math.round(revenue * (0.22 + c * 0.05));
      rows.push({
        date,
        channel: channels[c],
        product: products[(i + c) % products.length],
        manager: managers[(i + c * 2) % managers.length],
        leads,
        deals,
        revenue,
        spend
      });
    }
  }
  return rows;
}

function keyByGroup(row: RecordRow, groupBy: z.infer<typeof schema>["groupBy"]): string {
  if (groupBy === "channel") return row.channel;
  if (groupBy === "product") return row.product;
  if (groupBy === "manager") return row.manager;
  const y = row.date.getFullYear();
  const m = String(row.date.getMonth() + 1).padStart(2, "0");
  const d = String(row.date.getDate()).padStart(2, "0");
  if (groupBy === "day") return `${y}-${m}-${d}`;
  if (groupBy === "month") return `${y}-${m}`;
  const week = Math.ceil((row.date.getDate() + new Date(y, row.date.getMonth(), 1).getDay()) / 7);
  return `${y}-${m} W${week}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const periodToDays: Record<z.infer<typeof schema>["period"], number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "365d": 365
  };
  const rows = generateRows(periodToDays[input.period]);
  const bucket = new Map<string, { leads: number; deals: number; revenue: number; spend: number }>();

  for (const row of rows) {
    const key = keyByGroup(row, input.groupBy);
    const prev = bucket.get(key) ?? { leads: 0, deals: 0, revenue: 0, spend: 0 };
    prev.leads += row.leads;
    prev.deals += row.deals;
    prev.revenue += row.revenue;
    prev.spend += row.spend;
    bucket.set(key, prev);
  }

  const tableRows = Array.from(bucket.entries()).map(([dimension, agg]) => {
    const avgCheck = agg.deals > 0 ? agg.revenue / agg.deals : 0;
    const conversion = agg.leads > 0 ? (agg.deals / agg.leads) * 100 : 0;
    const romi = agg.spend > 0 ? ((agg.revenue - agg.spend) / agg.spend) * 100 : 0;
    const profit = agg.revenue - agg.spend;
    return {
      dimension,
      leads: agg.leads,
      deals: agg.deals,
      revenue: round(agg.revenue),
      spend: round(agg.spend),
      profit: round(profit),
      avg_check: round(avgCheck),
      conversion: round(conversion),
      romi: round(romi)
    };
  });

  const sortedRows = tableRows.sort((a, b) => (a.dimension > b.dimension ? 1 : -1));
  const totals = sortedRows.reduce(
    (acc, row) => {
      acc.revenue += row.revenue;
      acc.spend += row.spend;
      acc.profit += row.profit;
      acc.leads += row.leads;
      acc.deals += row.deals;
      return acc;
    },
    { revenue: 0, spend: 0, profit: 0, leads: 0, deals: 0 }
  );

  return NextResponse.json({
    ok: true,
    columns: ["dimension", ...input.metrics],
    rows: sortedRows.map((row) => {
      const result: Record<string, string | number> = { dimension: row.dimension };
      for (const metric of input.metrics) {
        result[metric] = row[metric];
      }
      return result;
    }),
    meta: {
      dataset: input.dataset,
      period: input.period,
      groupBy: input.groupBy,
      records: sortedRows.length
    },
    totals: {
      revenue: round(totals.revenue),
      spend: round(totals.spend),
      profit: round(totals.profit),
      avg_check: totals.deals > 0 ? round(totals.revenue / totals.deals) : 0,
      conversion: totals.leads > 0 ? round((totals.deals / totals.leads) * 100) : 0,
      romi: totals.spend > 0 ? round(((totals.revenue - totals.spend) / totals.spend) * 100) : 0
    }
  });
}

