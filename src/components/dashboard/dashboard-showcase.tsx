"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

const revenueData = [
  { month: "Янв", value: 1190000 },
  { month: "Фев", value: 1270000 },
  { month: "Мар", value: 1325000 },
  { month: "Апр", value: 1410000 },
  { month: "Май", value: 1495000 },
  { month: "Июн", value: 1580000 }
];

const channels = [
  { name: "VK", value: 680000 },
  { name: "Telegram", value: 520000 },
  { name: "Яндекс", value: 940000 },
  { name: "SEO", value: 430000 }
];

const riskData = [
  { name: "Норма", value: 68 },
  { name: "Риски", value: 32 }
];

const cashData = [
  { day: "1", in: 210000, out: 180000 },
  { day: "2", in: 175000, out: 220000 },
  { day: "3", in: 260000, out: 200000 },
  { day: "4", in: 240000, out: 235000 },
  { day: "5", in: 280000, out: 210000 },
  { day: "6", in: 220000, out: 260000 },
  { day: "7", in: 300000, out: 225000 }
];

export function DashboardShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <p className="mb-2 text-xs text-muted">Динамика выручки</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="showcaseRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: number | string | undefined) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`} />
              <Area dataKey="value" type="monotone" stroke="#0891b2" strokeWidth={2} fill="url(#showcaseRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-xs text-muted">Каналы продаж</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: number | string | undefined) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`} />
              <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-xs text-muted">Риск-профиль бизнеса</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={riskData} innerRadius={36} outerRadius={64} paddingAngle={2} fill="#f97316" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-xs text-muted">Cash In / Cash Out</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: number | string | undefined) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`} />
              <Bar dataKey="in" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="out" fill="#fb7185" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

