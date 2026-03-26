// src/execution/runtime/scenarioSheet/headerUtils.ts

import type ExcelJS from "exceljs";
import { AppError } from "@utils/errors";
import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";
import { defaultE2EPipelineTemplateConfig } from "@execution/modes/e2e/scenario/e2EPipelineTemplateConfig";
import { validateE2EPipelineTemplateHeaders } from "@execution/modes/e2e/scenario/e2EPipelineTemplateValidator";

function cellToString(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if ("result" in obj) return cellToString(obj.result);
        if ("text" in obj) return String(obj.text ?? "");
    }
    return String(value);
}

function normKey(value: unknown): string {
    return normalizeHeaderKey(value);
}

export function buildCanonicalHeaders(): Map<string, string> {
    const cfg = defaultE2EPipelineTemplateConfig;
    const map = new Map<string, string>();

    const baseHeaders = [
        ...cfg.requiredBaseHeaders,
        ...cfg.conditionalBaseHeaders.existingPolicy,
        ...cfg.conditionalBaseHeaders.newBusiness,
    ];

    baseHeaders.forEach((header) => map.set(normKey(header), header));

    for (let stepNo = 1; stepNo <= cfg.maxSteps; stepNo++) {
        cfg.stepFieldSuffixes.forEach((suffix) => {
            const header = `Step${stepNo}${suffix}`;
            map.set(normKey(header), header);
        });
    }

    return map;
}

export function getHeaders(worksheet: ExcelJS.Worksheet): string[] {
    const maxCol = worksheet.columnCount || worksheet.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(cellToString(worksheet.getCell(1, idx + 1).value))
    );
}

export function validateScenarioHeaders(headers: string[]): void {
    const errors = validateE2EPipelineTemplateHeaders(headers);

    if (!errors.length) {
        return;
    }

    throw new AppError({
        code: "SCENARIO_HEADER_VALIDATION_FAILED",
        stage: "load-scenario-sheet",
        source: "headerUtils",
        message: `E2E pipeline sheet header validation failed\n${errors.join("\n")}`,
        context: {
            errorCount: errors.length,
        },
    });
}