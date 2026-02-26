import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";
import * as XLSX from "xlsx";

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

function parseXlsxPreview(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { columns: [], rows: [], totalRows: 0 };
  }
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(sheet, { defval: "" });
  if (!rows.length) {
    return { columns: [], rows: [], totalRows: 0 };
  }
  const columns = Object.keys(rows[0] ?? {});
  const previewRows = rows.slice(0, 20);
  return { columns, rows: previewRows, totalRows: rows.length };
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
    const preview = parseXlsxPreview(buffer);
    return NextResponse.json({
      fileName,
      format: "xlsx",
      ...preview,
      _meta: { mode: "demo", generatedAt: new Date().toISOString() }
    });
  }

  return NextResponse.json({ error: "Поддерживаются только CSV/XLSX" }, { status: 415 });
}
