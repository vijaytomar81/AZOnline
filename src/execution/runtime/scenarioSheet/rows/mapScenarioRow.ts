// src/execution/runtime/scenarioSheet/rows/mapScenarioRow.ts

import type ExcelJS from "exceljs";
import { normalizeSpaces } from "@utils/text";
import type { RawScenarioRow } from "@execution/modes/e2e/scenario/types";
import { cellToString } from "../shared/cellToString";
import { isEmptyScenarioRow } from "./isEmptyScenarioRow";

export function mapScenarioRow(
    worksheet: ExcelJS.Worksheet,
    headers: string[],
    rowNo: number
): RawScenarioRow | null {
    const values = headers.map((_, idx) =>
        normalizeSpaces(cellToString(worksheet.getCell(rowNo, idx + 1).value))
    );

    if (isEmptyScenarioRow(values)) {
        return null;
    }

    const row: RawScenarioRow = { ScenarioId: "" };

    headers.forEach((header, idx) => {
        if (!header) {
            return;
        }

        row[header] = values[idx];
    });

    return row;
}
