import { Card } from "@/components/ui/card";

const sources = [
  { type: "google_sheets", name: "P&L 2026", status: "active", lastSync: "2 мин назад" },
  { type: "excel_upload", name: "leads_feb.xlsx", status: "parsed", lastSync: "15 мин назад" },
  { type: "bitrix24", name: "Bitrix24 CRM", status: "active", lastSync: "1 час назад" }
];

export default function SourcesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Подключить источник данных</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-xl border border-border p-3 text-left text-sm">Google Sheets / Drive</button>
          <button className="rounded-xl border border-border p-3 text-left text-sm">Excel / CSV upload</button>
          <button className="rounded-xl border border-border p-3 text-left text-sm">Word / DOCX</button>
          <button className="rounded-xl border border-border p-3 text-left text-sm">Webhook / CRM API</button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Текущие источники</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="pb-2">Тип</th>
                <th className="pb-2">Название</th>
                <th className="pb-2">Статус</th>
                <th className="pb-2">Последний sync</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((item) => (
                <tr key={item.name} className="border-t border-border">
                  <td className="py-2">{item.type}</td>
                  <td className="py-2 font-medium">{item.name}</td>
                  <td className="py-2">{item.status}</td>
                  <td className="py-2">{item.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
