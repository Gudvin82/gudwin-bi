import { z } from "zod";
import type { DataSourceConnector } from "./types";
import { getValidGoogleAccessToken } from "@/lib/integrations/google-oauth";

const schema = z.object({
  sheetUrl: z.string().url(),
  range: z.string().default("A:Z"),
  authMode: z.enum(["public", "oauth"]).optional(),
  workspaceId: z.string().optional()
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
    const range = parsed.range ?? "A:Z";

    if (parsed.authMode === "oauth" && parsed.workspaceId) {
      const accessToken = await getValidGoogleAccessToken(parsed.workspaceId);
      if (!accessToken) {
        return {
          rows: 0,
          schema: [],
          sample: [{ error: "OAuth не подключен. Авторизуйте Google в источниках." }]
        };
      }
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
      const apiRes = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!apiRes.ok) {
        return {
          rows: 0,
          schema: [],
          sample: [{ error: "Не удалось прочитать Google Sheet через OAuth. Проверьте доступы." }]
        };
      }
      const payload = (await apiRes.json()) as { values?: string[][] };
      const values = payload.values ?? [];
      const header = values[0] ?? [];
      const columns = header.map((item) => item.trim()).filter(Boolean);
      const sheetSchema = columns.map((name) => ({ name, type: /date|дата/i.test(name) ? "date" : "string" }));
      const sample = values.slice(1, 4).map((row) => {
        const item: Record<string, unknown> = {};
        columns.forEach((col, idx) => {
          item[col] = row[idx] ?? "";
        });
        return item;
      });
      return {
        rows: Math.max(values.length - 1, 0),
        schema: sheetSchema,
        sample
      };
    }

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
    const sheetSchema = columns.map((name) => ({ name, type: /date|дата/i.test(name) ? "date" : "string" }));
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
      schema: sheetSchema,
      sample
    };
  }
};
