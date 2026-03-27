// src/data/builder/core/spreadsheet/buildRowIndex.ts

import type ExcelJS from "exceljs";
import { cellToString } from "./cellValue";
import { normKey } from "./normalizeSheetValue";

export function buildRowIndex(
    ws: ExcelJS.Worksheet,
    fieldCol: number,
    dataStartRow: number
): Map<string, number> {
    const out = new Map<string, number>();
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = dataStartRow; r <= maxRow; r++) {
        const field = normKey(cellToString(ws.getCell(r, fieldCol).value));
        if (field && !out.has(field)) {
            out.set(field, r);
        }
    }

    return out;
}