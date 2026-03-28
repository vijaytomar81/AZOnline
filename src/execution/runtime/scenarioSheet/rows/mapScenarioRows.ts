// src/execution/runtime/scenarioSheet/rows/mapScenarioRows.ts

import type ExcelJS from "exceljs";
import type { RawScenarioRow } from "@execution/modes/e2e/scenario/types";
import { mapScenarioRow } from "./mapScenarioRow";

export function mapScenarioRows(
    worksheet: ExcelJS.Worksheet,
    headers: string[]
): RawScenarioRow[] {
    const rows: RawScenarioRow[] = [];
    const maxRow = worksheet.rowCount || worksheet.actualRowCount || 0;

    for (let rowNo = 2; rowNo <= maxRow; rowNo++) {
        const row = mapScenarioRow(worksheet, headers, rowNo);

        if (row) {
            rows.push(row);
        }
    }

    return rows;
}
