// src/data/builder/core/extractMeta/extractTabularMeta.ts

import type ExcelJS from "exceljs";
import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";
import { cellToString, norm } from "../spreadsheet";

type TabularCaseMeta = {
    row: number;
    scriptId: string;
    scriptName: string;
};

export type TabularMeta = {
    sheet: string;
    layout: "tabular";
    dataStartRow: number;
    caseMetas: TabularCaseMeta[];
    tabularHeaders: string[];
};

function getHeaderRow(ws: ExcelJS.Worksheet, rowNo: number): string[] {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(cellToString(ws.getCell(rowNo, idx + 1).value))
    ).filter(Boolean);
}

function detectTabularCaseMetas(
    ws: ExcelJS.Worksheet,
    testCaseIdCol: number
): TabularCaseMeta[] {
    const out: TabularCaseMeta[] = [];
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let rowNo = 2; rowNo <= maxRow; rowNo++) {
        const testCaseId = norm(
            cellToString(ws.getCell(rowNo, testCaseIdCol).value)
        );

        if (!testCaseId) {
            continue;
        }

        out.push({
            row: rowNo,
            scriptId: testCaseId,
            scriptName: testCaseId,
        });
    }

    return out;
}

export function extractTabularMeta(
    ws: ExcelJS.Worksheet
): TabularMeta | null {
    const headers = getHeaderRow(ws, 1);
    const headerMap = new Map(
        headers.map((header, idx) => [normalizeHeaderKey(header), idx + 1])
    );

    const testCaseIdCol = headerMap.get(normalizeHeaderKey("TestCaseId"));
    if (!testCaseIdCol) {
        return null;
    }

    return {
        sheet: String(ws.name ?? "").trim() || "Sheet",
        layout: "tabular",
        dataStartRow: 2,
        caseMetas: detectTabularCaseMetas(ws, testCaseIdCol),
        tabularHeaders: headers,
    };
}