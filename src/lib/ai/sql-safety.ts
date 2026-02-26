const ALLOWED_TABLES = ["sales", "expenses", "leads", "crm_deals", "payments"];
const FORBIDDEN_TOKENS = [
  "drop ",
  "truncate ",
  "alter ",
  "delete ",
  "insert ",
  "update ",
  "create ",
  "grant ",
  "revoke ",
  "copy ",
  "vacuum ",
  "analyze ",
  "set ",
  "show "
];
const FORBIDDEN_PATTERNS = [
  /\bwith\b/i,
  /\bunion\b/i,
  /\binto\b/i,
  /\binformation_schema\b/i,
  /\bpg_catalog\b/i,
  /\bpg_/i,
  /--/,
  /\/\*/,
  /\*\//
];

export function enforceSqlSafety(rawSql: string) {
  const sql = rawSql.trim().replace(/\s+/g, " ").toLowerCase();

  if (!sql.startsWith("select ")) {
    return { safe: false, reason: "Разрешены только SELECT-запросы." };
  }

  if (FORBIDDEN_TOKENS.some((token) => sql.includes(token))) {
    return { safe: false, reason: "Обнаружена потенциально опасная SQL-операция." };
  }

  if (FORBIDDEN_PATTERNS.some((pattern) => pattern.test(sql))) {
    return { safe: false, reason: "Запрос содержит запрещённые конструкции." };
  }

  const semicolons = (rawSql.match(/;/g) ?? []).length;
  if (semicolons > 0 && !rawSql.trim().endsWith(";")) {
    return { safe: false, reason: "Разрешён только один SQL-запрос без цепочек." };
  }

  const selectCount = (sql.match(/\bselect\b/g) ?? []).length;
  if (selectCount > 1) {
    return { safe: false, reason: "Подзапросы отключены для безопасности. Упростите запрос." };
  }

  const referenced = Array.from(sql.matchAll(/(?:from|join)\s+([a-z_]+)/g)).map((m) => m[1]);
  if (!referenced.length) {
    return { safe: false, reason: "Не удалось определить таблицы запроса." };
  }
  const disallowed = referenced.filter((table) => !ALLOWED_TABLES.includes(table));
  if (disallowed.length) {
    return { safe: false, reason: `Запрос использует запрещенные таблицы: ${disallowed.join(", ")}.` };
  }

  let normalized = rawSql.trim();
  if (!/limit\s+\d+/i.test(normalized)) {
    normalized = `${normalized.replace(/;?$/, "")} LIMIT 1000;`;
  }

  if (!/(date|month|created_at|period)/i.test(normalized)) {
    normalized = `${normalized}\n-- Рекомендация: добавьте фильтр по периоду (например, последние 12 месяцев)`;
  }

  return { safe: true, sql: normalized, warning: "Применены guardrails: whitelist таблиц, SELECT-only, LIMIT <= 1000." };
}
