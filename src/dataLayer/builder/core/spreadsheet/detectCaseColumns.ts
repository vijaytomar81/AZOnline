// src/dataLayer/builder/core/spreadsheet/detectCaseColumns.ts

import type ExcelJS from "exceljs";
import { DataBuilderError } from "../../errors";
import { cellToString } from "./cellValue";
import { norm } from "./normalizeSheetValue";

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
        throw new DataBuilderError({
            code: "CASE_COLUMNS_NOT_FOUND",
            stage: "extract-meta",
            source: "detectCaseColumns",
            message: "No case columns found on anchor row.",
            context: {
                worksheetName: ws.name,
                anchorRow,
                caseStartCol,
            },
        });
    }

    return cols;
}