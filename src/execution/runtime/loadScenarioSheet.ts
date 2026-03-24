// src/execution/runtime/loadScenarioSheet.ts

import path from "node:path";
import { AppError } from "@utils/errors";
import { fileExists } from "@utils/fs";
import type { Logger } from "@utils/logger";
import type { RawScenarioRow } from "@execution/modes/e2e/scenario/types";
import {
    loadWorkbookAndWorksheet,
    type LoadedWorksheet,
} from "@execution/runtime/scenarioSheet/excelSheetLoader";
import {
    buildCanonicalHeaders,
    getHeaders,
    validateScenarioHeaders,
} from "@execution/runtime/scenarioSheet/headerUtils";
import { mapScenarioRows } from "@execution/runtime/scenarioSheet/rowMapper";

export type LoadScenarioSheetResult = {
    sheetName: string;
    headers: string[];
    rows: RawScenarioRow[];
};

function resolveExcelPath(excelPath: string): string {
    return path.isAbsolute(excelPath) ? excelPath : path.join(process.cwd(), excelPath);
}

function ensureExcelExists(absExcel: string, excelPath: string): void {
    if (!fileExists(absExcel)) {
        throw new AppError({
            code: "EXECUTION_EXCEL_NOT_FOUND",
            stage: "load-scenario-sheet",
            source: "loadScenarioSheet",
            message: `Execution Excel file not found: ${absExcel}`,
            context: {
                excelPath,
                absExcel,
            },
        });
    }
}

function buildHeaders(loaded: LoadedWorksheet): string[] {
    const rawHeaders = getHeaders(loaded.worksheet);
    validateScenarioHeaders(rawHeaders);

    const canonicalHeaders = buildCanonicalHeaders();
    return rawHeaders.map((header) => canonicalHeaders.get(header) ?? header);
}

export async function loadScenarioSheet(args: {
    excelPath: string;
    sheetName: string;
    log?: Logger;
}): Promise<LoadScenarioSheetResult> {
    const absExcel = resolveExcelPath(args.excelPath);
    ensureExcelExists(absExcel, args.excelPath);

    args.log?.info(`Loading execution workbook: ${absExcel}`);

    const loaded = await loadWorkbookAndWorksheet({
        absExcel,
        requestedSheetName: args.sheetName,
    });

    args.log?.debug(
        `Workbook sheets: ${loaded.workbook.worksheets.map((item) => item.name).join(", ")}`
    );

    const headers = buildHeaders(loaded);
    const rows = mapScenarioRows(loaded.worksheet, headers);

    args.log?.info(`Loaded execution sheet: ${loaded.worksheet.name}`);
    args.log?.info(`Scenario rows loaded: ${rows.length}`);
    args.log?.debug(`Headers: ${headers.filter(Boolean).join(", ")}`);

    return {
        sheetName: loaded.worksheet.name,
        headers,
        rows,
    };
}