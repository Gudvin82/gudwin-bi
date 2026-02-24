import { Card } from "@/components/ui/card";

const rows = [
  { channel: "Онлайн-магазин", leads: 1240, conversion: "8.2%", avgCheck: "3 870 ₽" },
  { channel: "Маркетплейс", leads: 990, conversion: "6.9%", avgCheck: "4 240 ₽" },
  { channel: "Розница", leads: 470, conversion: "12.4%", avgCheck: "2 960 ₽" }
];

export function KpiTable() {
  return (
    <Card className="col-span-12 lg:col-span-4">
      <h3 className="mb-4 text-base font-semibold">Каналы продаж</h3>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="pb-3">Канал</th>
              <th className="pb-3">Лиды</th>
              <th className="pb-3">Конв.</th>
              <th className="pb-3">Ср. чек</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.channel} className="border-t border-border">
                <td className="py-3 font-medium">{row.channel}</td>
                <td className="py-3">{row.leads}</td>
                <td className="py-3">{row.conversion}</td>
                <td className="py-3">{row.avgCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 sm:hidden">
        {rows.map((row) => (
          <div key={row.channel} className="rounded-xl border border-border p-3">
            <p className="font-semibold">{row.channel}</p>
            <p className="text-sm text-muted">Лиды: {row.leads}</p>
            <p className="text-sm text-muted">Конверсия: {row.conversion}</p>
            <p className="text-sm text-muted">Ср. чек: {row.avgCheck}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
