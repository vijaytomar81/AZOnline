// src/data/builder/core/excelRuntime.ts
import type ExcelJS from "exceljs";
import { defaultSheetLayoutConfig } from "./sheetLayoutConfig";

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

function matchesAlias(value: string, aliases: string[]): boolean {
    const key = normKey(value);
    return aliases.some((alias) => normKey(alias) === key);
}

function findHeaderColumn(
    ws: ExcelJS.Worksheet,
    headerRow: number,
    aliases: string[]
): number | null {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    for (let c = 1; c <= maxCol; c++) {
        const value = cellToString(ws.getCell(headerRow, c).value);
        if (matchesAlias(value, aliases)) return c;
    }

    return null;
}

export function detectLayout(ws: ExcelJS.Worksheet): SheetLayout {
    const cfg = defaultSheetLayoutConfig;
    const headerRow = cfg.headerRow;

    const sectionCol = findHeaderColumn(ws, headerRow, cfg.sectionHeaderAliases);
    const fieldCol = findHeaderColumn(ws, headerRow, cfg.fieldHeaderAliases);
    const appFieldCol = findHeaderColumn(ws, headerRow, cfg.appFieldHeaderAliases);
    const firstValueCol = findHeaderColumn(ws, headerRow, cfg.valueHeaderAliases);

    if (fieldCol && firstValueCol) {
        return {
            dataStartRow: headerRow + 1,
            fieldCol,
            caseStartCol: firstValueCol,
        };
    }

    // Backward-compatible pattern:
    // A=Section, B=StandardFieldName, C=ApplicationFieldName, D+=case values
    const a1 = normKey(cellToString(ws.getCell(1, 1).value));
    const b1 = normKey(cellToString(ws.getCell(1, 2).value));
    const c1 = normKey(cellToString(ws.getCell(1, 3).value));

    if (a1 === "section" && b1 === "standardfieldname" && c1 === "applicationfieldname") {
        return { dataStartRow: 2, fieldCol: 2, caseStartCol: 4 };
    }

    // Backward-compatible pattern:
    // A=Section, B=StandardFieldName, C+=case values
    if (a1 === "section" && b1 === "standardfieldname") {
        const c1Raw = cellToString(ws.getCell(1, 3).value);
        const d1Raw = cellToString(ws.getCell(1, 4).value);

        if (
            matchesAlias(c1Raw, cfg.valueHeaderAliases) ||
            matchesAlias(d1Raw, cfg.valueHeaderAliases)
        ) {
            return { dataStartRow: 2, fieldCol: 2, caseStartCol: 3 };
        }
    }

    const knownHeaders = [
        ...cfg.sectionHeaderAliases,
        ...cfg.fieldHeaderAliases,
        ...cfg.appFieldHeaderAliases,
        ...cfg.valueHeaderAliases,
    ].join(", ");

    throw new Error(
        `Unable to detect sheet layout. Expected common template headers like: ${knownHeaders}`
    );
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
    anchorRow: number,
    caseStartCol: number
): number[] {
    const cols: number[] = [];
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    for (let c = caseStartCol; c <= maxCol; c++) {
        const value = norm(cellToString(ws.getCell(anchorRow, c).value));
        if (!value) break;
        cols.push(c);
    }

    if (!cols.length) {
        throw new Error("No case columns found on anchor row.");
    }

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