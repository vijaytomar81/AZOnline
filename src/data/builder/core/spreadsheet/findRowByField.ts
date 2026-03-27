// src/data/builder/core/spreadsheet/findRowByField.ts

import type ExcelJS from "exceljs";
import { DataBuilderError } from "../../errors";
import { cellToString } from "./cellValue";
import { normKey } from "./normalizeSheetValue";

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

    throw new DataBuilderError({
        code: "FIELD_ROW_NOT_FOUND",
        stage: "extract-meta",
        source: "findRowByField",
        message: `Field row not found. Tried: ${labels.join(", ")}`,
        context: {
            worksheetName: ws.name,
            fieldCol,
            dataStartRow,
            labels: labels.join(", "),
        },
    });
}