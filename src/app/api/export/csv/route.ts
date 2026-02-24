const rows = [
  ["month", "revenue", "avg_check"],
  ["2026-01", "1200000", "3100"],
  ["2026-02", "1370000", "3290"]
];

export async function GET() {
  const body = rows.map((r) => r.join(",")).join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="report.csv"`
    }
  });
}
