"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { month: "Янв", revenue: 420000 },
  { month: "Фев", revenue: 510000 },
  { month: "Мар", revenue: 610000 },
  { month: "Апр", revenue: 560000 },
  { month: "Май", revenue: 720000 },
  { month: "Июн", revenue: 840000 }
];

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="col-span-12 lg:col-span-8">
      <h3 className="mb-4 text-base font-semibold">Выручка по месяцам</h3>
      <div className="h-72">
        {!mounted ? (
          <div className="skeleton h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip
                formatter={(value: number | string | undefined) =>
                  `${Number(value ?? 0).toLocaleString("ru-RU")} ₽`
                }
              />
              <Area type="monotone" dataKey="revenue" stroke="#0F766E" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
