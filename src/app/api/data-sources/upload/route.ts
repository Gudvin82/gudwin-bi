import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";

type PreviewRow = Record<string, string | number | null>;

function detectDelimiter(headerLine: string) {
  const comma = (headerLine.match(/,/g) ?? []).length;
  const semicolon = (headerLine.match(/;/g) ?? []).length;
  return semicolon > comma ? ";" : ",";
}

function parseCsvPreview(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0] ?? "";
  const delimiter = detectDelimiter(header);
  const columns = header.split(delimiter).map((item) => item.trim()).filter(Boolean);
  const rows: PreviewRow[] = [];
  for (const line of lines.slice(1, 21)) {
    const values = line.split(delimiter);
    const row: PreviewRow = {};
    columns.forEach((col, idx) => {
      row[col] = values[idx]?.trim() ?? "";
    });
    rows.push(row);
  }
  return { columns, rows, totalRows: Math.max(lines.length - 1, 0) };
}

export async function POST(request: Request) {
  await getSessionContext();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  const fileName = "name" in file ? String((file as File).name) : "upload";
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (ext === "csv") {
    const text = buffer.toString("utf8");
    const preview = parseCsvPreview(text);
    return NextResponse.json({
      fileName,
      format: "csv",
      ...preview,
      _meta: { mode: "demo", generatedAt: new Date().toISOString() }
    });
  }

  if (ext === "xlsx" || ext === "xls") {
    return NextResponse.json(
      {
        error: "XLSX в подготовке. Пока поддерживается CSV.",
        _meta: { mode: "demo", generatedAt: new Date().toISOString() }
      },
      { status: 415 }
    );
  }

  return NextResponse.json({ error: "Поддерживаются только CSV/XLSX" }, { status: 415 });
}
