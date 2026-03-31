// src/dataLayer/builder/core/buildCases/tabular/buildTabularRowValueMap.ts

import type ExcelJS from "exceljs";
import { normalizeHeaderKey } from "@utils/text";
import { cellToString, norm } from "../../spreadsheet";

export function buildTabularRowValueMap(
    ws: ExcelJS.Worksheet,
    rowNo: number,
    headers: string[]
): Map<string, string> {
    const out = new Map<string, string>();

    headers.forEach((header, idx) => {
        const value = norm(cellToString(ws.getCell(rowNo, idx + 1).value));
        out.set(normalizeHeaderKey(header), value);
    });

    return out;
}

export function readTabularRowValue(
    rowMap: Map<string, string>,
    fieldName: string
): string {
    return rowMap.get(normalizeHeaderKey(fieldName)) ?? "";
}