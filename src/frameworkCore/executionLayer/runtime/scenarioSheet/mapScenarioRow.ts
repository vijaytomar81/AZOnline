// src/executionLayer/runtime/scenarioSheet/mapScenarioRow.ts

import type ExcelJS from "exceljs";
import { normalizeSpaces } from "@utils/text";
import type { RawExecutionScenarioRow } from "./types";

function cellToString(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;

        if ("result" in obj) {
            return cellToString(obj.result);
        }

        if ("text" in obj) {
            return String(obj.text ?? "");
        }
    }

    return String(value);
}

function isEmptyRow(values: string[]): boolean {
    return values.every((value) => !normalizeSpaces(value));
}

export function mapScenarioRow(args: {
    worksheet: ExcelJS.Worksheet;
    headers: string[];
    rowNo: number;
}): RawExecutionScenarioRow | null {
    const values = args.headers.map((_, index) =>
        normalizeSpaces(
            cellToString(args.worksheet.getCell(args.rowNo, index + 1).value)
        )
    );

    if (isEmptyRow(values)) {
        return null;
    }

    const row: RawExecutionScenarioRow = { ScenarioId: "" };

    args.headers.forEach((header, index) => {
        if (!header) {
            return;
        }

        row[header] = values[index];
    });

    return row;
}
