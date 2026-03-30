// src/dataLayer/builder/core/loadExcel/resolveWorksheet.ts

import type ExcelJS from "exceljs";
import { normalizeSheetKey } from "@utils/text";
import { DataBuilderError } from "../../errors";

export function resolveWorksheet(
    workbook: ExcelJS.Workbook,
    requestedSheetName: string
): ExcelJS.Worksheet {
    const trimmedSheetName = String(requestedSheetName ?? "").trim();

    if (!trimmedSheetName) {
        throw new DataBuilderError({
            code: "SHEET_NAME_MISSING",
            stage: "load-excel",
            source: "resolveWorksheet",
            message: "Missing sheetName. Provide --sheet (or SHEET).",
        });
    }

    const worksheets = Array.isArray(workbook.worksheets)
        ? workbook.worksheets
        : [];

    const worksheetNames = worksheets.map((worksheet) => worksheet.name);

    const exactMatch = worksheets.find(
        (worksheet) => worksheet.name === trimmedSheetName
    );

    if (exactMatch) {
        return exactMatch;
    }

    const requestedKey = normalizeSheetKey(trimmedSheetName);
    const normalizedMatches = worksheets.filter(
        (worksheet) => normalizeSheetKey(worksheet.name) === requestedKey
    );

    if (normalizedMatches.length === 1) {
        return normalizedMatches[0];
    }

    if (normalizedMatches.length > 1) {
        throw new DataBuilderError({
            code: "WORKSHEET_NAME_AMBIGUOUS",
            stage: "load-excel",
            source: "resolveWorksheet",
            message: [
                `Sheet "${trimmedSheetName}" is ambiguous after normalization.`,
                "",
                "Matching sheets found:",
                ...normalizedMatches.map((worksheet) => `  - ${worksheet.name}`),
                "",
                "Please pass the exact worksheet name.",
            ].join("\n"),
            context: {
                requestedSheetName: trimmedSheetName,
                matchingSheets: normalizedMatches.map((w) => w.name).join(", "),
            },
        });
    }

    throw new DataBuilderError({
        code: "WORKSHEET_NOT_FOUND",
        stage: "load-excel",
        source: "resolveWorksheet",
        message:
            `Sheet "${trimmedSheetName}" not found. Available: ` +
            `${worksheetNames.join(", ")}`,
        context: {
            requestedSheetName: trimmedSheetName,
            availableSheets: worksheetNames.join(", "),
        },
    });
}