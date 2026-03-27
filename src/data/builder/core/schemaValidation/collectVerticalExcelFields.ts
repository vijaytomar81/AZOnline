// src/data/builder/core/schemaValidation/collectVerticalExcelFields.ts

import type ExcelJS from "exceljs";
import { buildRowIndex, cellToString, norm, normKey } from "../spreadsheet";

export function collectVerticalExcelFields(
    ws: ExcelJS.Worksheet,
    fieldCol: number,
    dataStartRow: number
) {
    const rows = buildRowIndex(ws, fieldCol, dataStartRow);
    const duplicates: string[] = [];
    const seen = new Set<string>();
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = dataStartRow; r <= maxRow; r++) {
        const raw = norm(cellToString(ws.getCell(r, fieldCol).value));
        if (!raw) continue;

        const key = normKey(raw);
        if (seen.has(key)) duplicates.push(raw);
        seen.add(key);
    }

    return { rows, duplicates };
}