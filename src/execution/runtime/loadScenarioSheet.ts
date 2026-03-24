// src/execution/runtime/loadScenarioSheet.ts

import path from "node:path";
import ExcelJS from "exceljs";
import { AppError } from "../../utils/errors";
import { fileExists } from "../../utils/fs";
import { normalizeHeaderKey, normalizeSheetKey, normalizeSpaces } from "../../utils/text";
import type { Logger } from "../../utils/logger";
import { defaultE2EPipelineTemplateConfig } from "../scenario/e2EPipelineTemplateConfig";
import { validateE2EPipelineTemplateHeaders } from "../scenario/e2EPipelineTemplateValidator";
import type { RawScenarioRow } from "../scenario/types";

export type LoadScenarioSheetResult = {
    sheetName: string;
    headers: string[];
    rows: RawScenarioRow[];
};

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

function buildCanonicalHeaders(): Map<string, string> {
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

function getHeaders(ws: ExcelJS.Worksheet): string[] {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;
    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(cellToString(ws.getCell(1, idx + 1).value))
    );
}

function isEmptyRow(values: string[]): boolean {
    return values.every((value) => !normalizeSpaces(value));
}

function resolveWorksheet(
    workbook: ExcelJS.Workbook,
    requestedSheetName: string
): ExcelJS.Worksheet {
    const worksheets = Array.isArray(workbook.worksheets) ? workbook.worksheets : [];
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
            source: "loadScenarioSheet",
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
        source: "loadScenarioSheet",
        message: `Sheet "${requestedSheetName}" not found. Available: ${worksheetNames.join(", ")}`,
        context: {
            requestedSheetName,
            availableSheets: worksheetNames.join(", "),
        },
    });
}

export async function loadScenarioSheet(args: {
    excelPath: string;
    sheetName: string;
    log?: Logger;
}): Promise<LoadScenarioSheetResult> {
    const absExcel = path.isAbsolute(args.excelPath)
        ? args.excelPath
        : path.join(process.cwd(), args.excelPath);

    if (!fileExists(absExcel)) {
        throw new AppError({
            code: "EXECUTION_EXCEL_NOT_FOUND",
            stage: "load-scenario-sheet",
            source: "loadScenarioSheet",
            message: `Execution Excel file not found: ${absExcel}`,
            context: {
                excelPath: args.excelPath,
                absExcel,
            },
        });
    }

    args.log?.info(`Loading execution workbook: ${absExcel}`);

    const wb = new ExcelJS.Workbook();

    try {
        await wb.xlsx.readFile(absExcel);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new AppError({
            code: "EXECUTION_WORKBOOK_READ_FAILED",
            stage: "load-scenario-sheet",
            source: "loadScenarioSheet",
            message: `Failed to read execution workbook "${absExcel}": ${message}`,
            context: {
                absExcel,
            },
        });
    }

    const ws = resolveWorksheet(wb, args.sheetName);
    args.log?.debug(`Workbook sheets: ${wb.worksheets.map((item) => item.name).join(", ")}`);

    const rawHeaders = getHeaders(ws);
    const headerErrors = validateE2EPipelineTemplateHeaders(rawHeaders);
    if (headerErrors.length) {
        throw new AppError({
            code: "SCENARIO_HEADER_VALIDATION_FAILED",
            stage: "load-scenario-sheet",
            source: "loadScenarioSheet",
            message: `E2E pipeline sheet header validation failed\n${headerErrors.join("\n")}`,
            context: {
                sheetName: ws.name,
                errorCount: headerErrors.length,
            },
        });
    }

    const canonicalHeaders = buildCanonicalHeaders();
    const headers = rawHeaders.map((header) => canonicalHeaders.get(normKey(header)) ?? header);
    const rows: RawScenarioRow[] = [];
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let rowNo = 2; rowNo <= maxRow; rowNo++) {
        const values = headers.map((_, idx) =>
            normalizeSpaces(cellToString(ws.getCell(rowNo, idx + 1).value))
        );

        if (isEmptyRow(values)) continue;

        const row: RawScenarioRow = { ScenarioId: "" };
        headers.forEach((header, idx) => {
            if (!header) return;
            row[header] = values[idx];
        });

        rows.push(row);
    }

    args.log?.info(`Loaded execution sheet: ${ws.name}`);
    args.log?.info(`Scenario rows loaded: ${rows.length}`);
    args.log?.debug(`Headers: ${headers.filter(Boolean).join(", ")}`);

    return {
        sheetName: ws.name,
        headers,
        rows,
    };
}