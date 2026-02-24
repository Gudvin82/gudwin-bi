import { z } from "zod";
import type { DataSourceConnector } from "./types";

const schema = z.object({
  baseUrl: z.string().url(),
  token: z.string().min(6),
  entity: z.string().default("deals")
});

export const webhookConnector: DataSourceConnector = {
  type: "webhook",
  async validateConfig(input) {
    schema.parse(input);
  },
  async sync(config) {
    const parsed = schema.parse(config);
    return {
      rows: 2,
      schema: [
        { name: "id", type: "string" },
        { name: "amount", type: "number" },
        { name: "status", type: "string" }
      ],
      sample: [
        { id: "deal_1", amount: 10000, status: "won" },
        { id: "deal_2", amount: 5500, status: "pending", source: parsed.baseUrl }
      ]
    };
  }
};
