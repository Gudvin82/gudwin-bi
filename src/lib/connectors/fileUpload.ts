import { z } from "zod";
import type { DataSourceConnector } from "./types";

const schema = z.object({
  fileName: z.string().min(1),
  columns: z.array(z.string()).default([]),
  rows: z.number().int().nonnegative().default(0)
});

export const fileUploadConnector: DataSourceConnector = {
  type: "excel_upload",
  async validateConfig(input) {
    schema.parse(input);
  },
  async sync(config) {
    const parsed = schema.parse(config);
    const normalizedSchema = parsed.columns.length
      ? parsed.columns.map((name) => ({ name, type: /date|дата/i.test(name) ? "date" : "string" }))
      : [{ name: "column_1", type: "string" }];

    return {
      rows: parsed.rows,
      schema: normalizedSchema,
      sample: [{ file: parsed.fileName, rows: parsed.rows }]
    };
  }
};
