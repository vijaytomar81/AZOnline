// src/execution/runtime/scenarioSheet/rowMapper.ts

import type ExcelJS from "exceljs";
import { normalizeSpaces } from "@utils/text";
import type { RawScenarioRow } from "@execution/modes/e2e/scenario/types";

function cellToString(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if ("result" in obj) return cellToString(obj.result);
        if ("text" in obj) return String(obj.text ?? "");
    }
    return String(value);
}

function isEmptyRow(values: string[]): boolean {
    return values.every((value) => !normalizeSpaces(value));
}

function mapRow(
    worksheet: ExcelJS.Worksheet,
    headers: string[],
    rowNo: number
): RawScenarioRow | null {
    const values = headers.map((_, idx) =>
        normalizeSpaces(cellToString(worksheet.getCell(rowNo, idx + 1).value))
    );

    if (isEmptyRow(values)) {
        return null;
    }

    const row: RawScenarioRow = { ScenarioId: "" };

    headers.forEach((header, idx) => {
        if (!header) return;
        row[header] = values[idx];
    });

    return row;
}

export function mapScenarioRows(
    worksheet: ExcelJS.Worksheet,
    headers: string[]
): RawScenarioRow[] {
    const rows: RawScenarioRow[] = [];
    const maxRow = worksheet.rowCount || worksheet.actualRowCount || 0;

    for (let rowNo = 2; rowNo <= maxRow; rowNo++) {
        const row = mapRow(worksheet, headers, rowNo);
        if (row) rows.push(row);
    }

    return rows;
}