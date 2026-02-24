import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

type AiPlan = {
  summary: string;
  sql: string;
  visualization: "table" | "metric" | "line" | "bar";
  isFallback?: boolean;
};

export async function buildAnalyticPlan(question: string, datasetSchemas: string): Promise<AiPlan> {
  if (!client) {
    return {
      summary: "Тестовый режим: показана mock-аналитика. Добавьте OPENAI_API_KEY для реальной генерации.",
      sql: "select month, sum(revenue) as revenue, avg(check) as avg_check from sales group by month order by month;",
      visualization: "line",
      isFallback: true
    };
  }

  const prompt = `Ты аналитик BI. Верни JSON с полями summary, sql, visualization.\nDataset schemas:\n${datasetSchemas}\nВопрос: ${question}`;
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "ai_plan",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            sql: { type: "string" },
            visualization: { type: "string", enum: ["table", "metric", "line", "bar"] }
          },
          required: ["summary", "sql", "visualization"]
        }
      }
    }
  });

  const text = response.output_text;
  return { ...(JSON.parse(text) as AiPlan), isFallback: false };
}
