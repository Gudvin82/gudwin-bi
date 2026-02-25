import { z } from "zod";
import type { DataSourceConnector } from "./types";

const schema = z.object({
  sheetUrl: z.string().url(),
  range: z.string().default("A:Z")
});
type GoogleSheetsConfig = z.infer<typeof schema>;

export const googleSheetsConnector: DataSourceConnector = {
  type: "google_sheets",
  async validateConfig(input) {
    schema.parse(input);
  },
  async sync(config) {
    const parsed: GoogleSheetsConfig = schema.parse(config);
    const sheetIdMatch = parsed.sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return {
        rows: 0,
        schema: [],
        sample: [{ error: "Не удалось распознать ID таблицы. Проверьте ссылку." }]
      };
    }

    const sheetId = sheetIdMatch[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const res = await fetch(csvUrl);
    if (!res.ok) {
      return {
        rows: 0,
        schema: [],
        sample: [{ error: "Таблица недоступна. Сделайте её публичной или включите доступ по ссылке." }]
      };
    }

    const text = await res.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines[0] ?? "";
    const columns = header.split(",").map((item) => item.trim()).filter(Boolean);
    const schema = columns.map((name) => ({ name, type: /date|дата/i.test(name) ? "date" : "string" }));
    const sample = lines.slice(1, 4).map((line) => {
      const values = line.split(",");
      const row: Record<string, unknown> = {};
      columns.forEach((col, idx) => {
        row[col] = values[idx] ?? "";
      });
      return row;
    });
    return {
      rows: Math.max(lines.length - 1, 0),
      schema,
      sample
    };
  }
};
