// src/data/data-builder/core/excelRuntime.ts
import type ExcelJS from "exceljs";

export function cellToString(v: any): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "object") {
        if ("result" in v) return cellToString((v as any).result);
        if ("text" in v) return String((v as any).text ?? "");
        if ("richText" in v && Array.isArray((v as any).richText)) {
            return (v as any).richText.map((x: any) => x.text ?? "").join("");
        }
    }
    return String(v);
}

export function norm(s: string): string {
    return String(s ?? "").trim();
}

export function normKey(s: string): string {
    return norm(s).toLowerCase().replace(/\s+/g, "");
}

export type SheetLayout = {
    dataStartRow: number;
    fieldCol: number;
    caseStartCol: number;
};

export function detectLayout(ws: ExcelJS.Worksheet): SheetLayout {
    const a1 = normKey(cellToString(ws.getCell(1, 1).value));
    const b1 = normKey(cellToString(ws.getCell(1, 2).value));
    const c1 = normKey(cellToString(ws.getCell(1, 3).value));

    if (a1 === "section" && b1 === "standardfieldname" && c1 === "applicationfieldname") {
        return { dataStartRow: 2, fieldCol: 2, caseStartCol: 4 };
    }

    return { dataStartRow: 1, fieldCol: 1, caseStartCol: 2 };
}

export function findRowByField(
    ws: ExcelJS.Worksheet,
    fieldCol: number,
    dataStartRow: number,
    labels: string[]
): number {
    const wanted = labels.map(normKey);
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = dataStartRow; r <= maxRow; r++) {
        const value = normKey(cellToString(ws.getCell(r, fieldCol).value));
        if (wanted.includes(value)) return r;
    }

    throw new Error(`Field row not found. Tried: ${labels.join(", ")}`);
}

export function detectCaseColumns(
    ws: ExcelJS.Worksheet,
    scriptIdRow: number,
    caseStartCol: number
): number[] {
    const cols: number[] = [];
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    for (let c = caseStartCol; c <= maxCol; c++) {
        const id = norm(cellToString(ws.getCell(scriptIdRow, c).value));
        if (!id) break;
        cols.push(c);
    }

    if (!cols.length) throw new Error("No case columns found on ScriptId row.");
    return cols;
}

export function buildRowIndex(
    ws: ExcelJS.Worksheet,
    fieldCol: number,
    dataStartRow: number
): Map<string, number> {
    const out = new Map<string, number>();
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = dataStartRow; r <= maxRow; r++) {
        const field = normKey(cellToString(ws.getCell(r, fieldCol).value));
        if (field && !out.has(field)) out.set(field, r);
    }

    return out;
}