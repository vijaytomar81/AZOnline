// src/frameworkCore/executionLayer/runtime/scenarioSheet/buildScenarioHeaders.ts

import type ExcelJS from "exceljs";
import { normalizeSpaces } from "@utils/text";
import { normalizeE2EHeader } from "@frameworkCore/executionLayer/mode/e2e/schema";
import { validateTemplateHeaders } from "@frameworkCore/executionLayer/mode/e2e/scenario/template";

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

function getHeaders(worksheet: ExcelJS.Worksheet): string[] {
    const maxCol = worksheet.columnCount || worksheet.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, index) =>
        normalizeSpaces(cellToString(worksheet.getCell(1, index + 1).value))
    );
}

export function buildScenarioHeaders(
    worksheet: ExcelJS.Worksheet
): string[] {
    const rawHeaders = getHeaders(worksheet);
    const normalizedHeaders = rawHeaders.map(normalizeE2EHeader);

    validateTemplateHeaders(normalizedHeaders);

    return normalizedHeaders;
}
