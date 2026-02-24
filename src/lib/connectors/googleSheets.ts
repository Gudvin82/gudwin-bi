import { z } from "zod";
import type { DataSourceConnector } from "./types";

const schema = z.object({
  sheetUrl: z.string().url(),
  range: z.string().default("A:Z")
});

export const googleSheetsConnector: DataSourceConnector = {
  type: "google_sheets",
  async validateConfig(input) {
    schema.parse(input);
  },
  async sync(config) {
    const parsed = schema.parse(config);
    return {
      rows: 3,
      schema: [
        { name: "date", type: "date" },
        { name: "revenue", type: "number" },
        { name: "channel", type: "string" }
      ],
      sample: [
        { date: "2026-01-01", revenue: 120000, channel: "online" },
        { date: "2026-01-02", revenue: 133000, channel: "retail" },
        { source: parsed.sheetUrl }
      ]
    };
  }
};
