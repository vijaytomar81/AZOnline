// src/execution/runtime/scenarioSheet/workbook/resolveWorksheet.ts

import type ExcelJS from "exceljs";
import { AppError } from "@utils/errors";
import { normalizeSheetKey } from "@utils/text";

export function resolveWorksheet(
    workbook: ExcelJS.Workbook,
    requestedSheetName: string
): ExcelJS.Worksheet {
    const worksheets = Array.isArray(workbook.worksheets)
        ? workbook.worksheets
        : [];
    const worksheetNames = worksheets.map((item) => item.name);

    const exact = worksheets.find((item) => item.name === requestedSheetName);

    if (exact) {
        return exact;
    }

    const requestedKey = normalizeSheetKey(requestedSheetName);
    const normalizedMatches = worksheets.filter(
        (item) => normalizeSheetKey(item.name) === requestedKey
    );

    if (normalizedMatches.length === 1) {
        return normalizedMatches[0];
    }

    if (normalizedMatches.length > 1) {
        throw new AppError({
            code: "SCENARIO_SHEET_NAME_AMBIGUOUS",
            stage: "load-scenario-sheet",
            source: "excelSheetLoader",
            message: [
                `Sheet "${requestedSheetName}" is ambiguous after normalization.`,
                "",
                "Matching sheets found:",
                ...normalizedMatches.map((item) => `  - ${item.name}`),
                "",
                "Please pass the exact worksheet name.",
            ].join("\n"),
            context: {
                requestedSheetName,
                matchingSheets: normalizedMatches.map((item) => item.name).join(", "),
            },
        });
    }

    throw new AppError({
        code: "SCENARIO_SHEET_NOT_FOUND",
        stage: "load-scenario-sheet",
        source: "excelSheetLoader",
        message: `Sheet "${requestedSheetName}" not found. Available: ${worksheetNames.join(", ")}`,
        context: {
            requestedSheetName,
            availableSheets: worksheetNames.join(", "),
        },
    });
}
