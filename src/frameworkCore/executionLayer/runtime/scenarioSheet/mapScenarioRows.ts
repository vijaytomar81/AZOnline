// src/frameworkCore/executionLayer/runtime/scenarioSheet/mapScenarioRows.ts

import type ExcelJS from "exceljs";
import type { RawExecutionScenarioRow } from "./types";
import { mapScenarioRow } from "./mapScenarioRow";

export function mapScenarioRows(args: {
    worksheet: ExcelJS.Worksheet;
    headers: string[];
}): RawExecutionScenarioRow[] {
    const rows: RawExecutionScenarioRow[] = [];
    const maxRow = args.worksheet.rowCount || args.worksheet.actualRowCount || 0;

    for (let rowNo = 2; rowNo <= maxRow; rowNo++) {
        const row = mapScenarioRow({
            worksheet: args.worksheet,
            headers: args.headers,
            rowNo,
        });

        if (row) {
            rows.push(row);
        }
    }

    return rows;
}
