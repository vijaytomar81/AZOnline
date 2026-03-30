// src/dataLayer/builder/core/spreadsheet/detectLayout.ts

import type ExcelJS from "exceljs";
import { defaultSheetLayoutConfig } from "../sheetLayoutConfig";
import { DataBuilderError } from "../../errors";
import { cellToString } from "./cellValue";
import { normKey } from "./normalizeSheetValue";

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

    const fieldCol = findHeaderColumn(ws, headerRow, cfg.fieldHeaderAliases);
    const firstValueCol = findHeaderColumn(ws, headerRow, cfg.valueHeaderAliases);

    if (fieldCol && firstValueCol) {
        return {
            dataStartRow: headerRow + 1,
            fieldCol,
            caseStartCol: firstValueCol,
        };
    }

    const a1 = normKey(cellToString(ws.getCell(1, 1).value));
    const b1 = normKey(cellToString(ws.getCell(1, 2).value));
    const c1 = normKey(cellToString(ws.getCell(1, 3).value));

    if (a1 === "section" && b1 === "standardfieldname" && c1 === "applicationfieldname") {
        return { dataStartRow: 2, fieldCol: 2, caseStartCol: 4 };
    }

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

    throw new DataBuilderError({
        code: "SHEET_LAYOUT_NOT_DETECTED",
        stage: "extract-meta",
        source: "detectLayout",
        message: `Unable to detect sheet layout. Expected headers like: ${knownHeaders}`,
        context: {
            worksheetName: ws.name,
            knownHeaders,
        },
    });
}