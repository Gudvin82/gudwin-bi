import OpenAI from "openai";

const aiApiKey = process.env.AITUNNEL_API_KEY || process.env.OPENAI_API_KEY;
const baseURL =
  process.env.OPENAI_BASE_URL ||
  (process.env.AITUNNEL_API_KEY ? "https://api.aitunnel.ru/v1" : undefined);
const aiModel = process.env.AI_MODEL || "gpt-4.1-mini";
const client = aiApiKey ? new OpenAI({ apiKey: aiApiKey, baseURL }) : null;

type AiPlan = {
  summary: string;
  sql: string;
  visualization: "table" | "metric" | "line" | "bar";
  isFallback?: boolean;
};

export async function buildAnalyticPlan(question: string, datasetSchemas: string): Promise<AiPlan> {
  if (!client) {
    return {
      summary: "AI-провайдер не подключен. Добавьте ключ в переменные окружения для реальной генерации.",
      sql: "select month, sum(revenue) as revenue, avg(check) as avg_check from sales group by month order by month;",
      visualization: "line",
      isFallback: true
    };
  }

  const prompt = `Ты аналитик BI. Верни только JSON с полями summary, sql, visualization.
visualization может быть только table|metric|line|bar.
Dataset schemas:
${datasetSchemas}
Вопрос: ${question}`;

  const response = await client.chat.completions.create({
    model: aiModel,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("AI вернул пустой ответ.");
  }

  const parsed = JSON.parse(raw) as Partial<AiPlan>;
  const visualization = parsed.visualization;
  const safeVisualization: AiPlan["visualization"] =
    visualization === "table" || visualization === "metric" || visualization === "line" || visualization === "bar" ? visualization : "table";

  return {
    summary: parsed.summary || "Сформирован аналитический план.",
    sql: parsed.sql || "select 1;",
    visualization: safeVisualization,
    isFallback: false
  };
}
