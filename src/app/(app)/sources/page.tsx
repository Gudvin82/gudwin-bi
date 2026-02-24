"use client";

import { FormEvent, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

type SourceRow = {
  type: string;
  name: string;
  status: string;
  lastSync: string;
};

const sourceTypeLabels: Record<string, string> = {
  google_sheets: "Google Sheets",
  excel_upload: "Загрузка Excel/CSV",
  bitrix24: "Bitrix24 CRM"
};

const initialSources: SourceRow[] = [
  { type: "google_sheets", name: "P&L 2026", status: "active", lastSync: "2 мин назад" },
  { type: "excel_upload", name: "leads_feb.xlsx", status: "parsed", lastSync: "15 мин назад" },
  { type: "bitrix24", name: "Bitrix24 CRM", status: "active", lastSync: "1 час назад" }
];

export default function SourcesPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  const [sheetMessage, setSheetMessage] = useState<string | null>(null);

  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadColumns, setUploadColumns] = useState<string[]>([]);
  const [uploadRows, setUploadRows] = useState(0);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [sources, setSources] = useState<SourceRow[]>(initialSources);

  const uploadPreview = useMemo(() => {
    if (!uploadFileName) {
      return "";
    }
    return `${uploadFileName}: ${uploadRows} строк, ${uploadColumns.length} колонок`;
  }, [uploadColumns.length, uploadFileName, uploadRows]);

  const connectGoogleSheets = async (event: FormEvent) => {
    event.preventDefault();
    setIsSheetLoading(true);
    setSheetMessage(null);

    try {
      const res = await fetch("/api/data-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "google_sheets",
          config: { sheetUrl, range: "A:Z" }
        })
      });

      if (!res.ok) {
        throw new Error("Не удалось подключить Google Sheets. Проверьте ссылку.");
      }

      const json = (await res.json()) as { syncJob?: { note?: string } };
      setSources((prev) => [
        {
          type: "google_sheets",
          name: sheetUrl,
          status: "queued_sync",
          lastSync: "только что"
        },
        ...prev
      ]);
      setSheetMessage(json.syncJob?.note ?? "Google Sheets подключен и отправлен в очередь синхронизации.");
      setSheetUrl("");
    } catch (error) {
      setSheetMessage(error instanceof Error ? error.message : "Ошибка подключения.");
    } finally {
      setIsSheetLoading(false);
    }
  };

  const onFilePicked = async (file: File | null) => {
    if (!file) {
      return;
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines[0] ?? "";
    const columns = header.split(/[;,]/).map((item) => item.trim()).filter(Boolean);

    setUploadFileName(file.name);
    setUploadColumns(columns);
    setUploadRows(Math.max(lines.length - 1, 0));
    setUploadMessage(null);
  };

  const uploadCsv = async () => {
    if (!uploadFileName) {
      setUploadMessage("Сначала выберите CSV/XLSX файл.");
      return;
    }

    setIsUploadLoading(true);
    setUploadMessage(null);

    try {
      const res = await fetch("/api/data-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "excel_upload",
          config: {
            fileName: uploadFileName,
            columns: uploadColumns,
            rows: uploadRows
          }
        })
      });

      if (!res.ok) {
        throw new Error("Не удалось обработать файл.");
      }

      const json = (await res.json()) as { syncJob?: { note?: string } };
      setSources((prev) => [
        {
          type: "excel_upload",
          name: uploadFileName,
          status: "queued_sync",
          lastSync: "только что"
        },
        ...prev
      ]);
      setUploadMessage(json.syncJob?.note ?? "Файл принят и поставлен в очередь фоновой обработки.");
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Ошибка загрузки.");
    } finally {
      setIsUploadLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Подключить источник данных</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={connectGoogleSheets} className="rounded-xl border border-border p-3">
            <p className="mb-2 text-sm font-semibold">Google Sheets</p>
            <input
              value={sheetUrl}
              onChange={(event) => setSheetUrl(event.target.value)}
              className="w-full rounded-xl border border-border p-2.5 text-sm"
              placeholder="Вставьте ссылку на Google Sheet"
              required
            />
            <button disabled={isSheetLoading} className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {isSheetLoading ? "Подключаем..." : "Подключить"}
            </button>
            {sheetMessage ? <p className="mt-2 text-xs text-muted">{sheetMessage}</p> : null}
          </form>

          <div className="rounded-xl border border-border p-3">
            <p className="mb-2 text-sm font-semibold">Загрузка Excel / CSV</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(event) => onFilePicked(event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-border p-2.5 text-sm"
            />
            {uploadPreview ? <p className="mt-2 text-xs text-muted">{uploadPreview}</p> : <p className="mt-2 text-xs text-muted">Выберите файл, чтобы увидеть превью схемы.</p>}
            <button onClick={uploadCsv} disabled={isUploadLoading} className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {isUploadLoading ? "Загружаем..." : "Загрузить и распарсить"}
            </button>
            {uploadMessage ? <p className="mt-2 text-xs text-muted">{uploadMessage}</p> : null}
          </div>
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
                <tr key={`${item.type}:${item.name}`} className="border-t border-border">
                  <td className="py-2">{sourceTypeLabels[item.type] ?? item.type}</td>
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
