// src/execution/runtime/loadScenario/loadScenarioSheet.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import { loadWorkbookAndWorksheet } from "@execution/runtime/scenarioSheet/workbook/loadWorkbookAndWorksheet";
import { mapScenarioRows } from "@execution/runtime/scenarioSheet/rows/mapScenarioRows";
import type { LoadScenarioSheetResult } from "./types";
import { buildScenarioHeaders } from "./buildScenarioHeaders";
import { ensureScenarioExcelExists } from "./ensureScenarioExcelExists";
import { resolveScenarioExcelPath } from "./resolveScenarioExcelPath";

export async function loadScenarioSheet(args: {
    excelPath: string;
    sheetName: string;
    logScope: string;
}): Promise<LoadScenarioSheetResult> {
    const absExcel = resolveScenarioExcelPath(args.excelPath);
    ensureScenarioExcelExists(absExcel, args.excelPath);

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Loading execution workbook: ${absExcel}`,
    });

    const loaded = await loadWorkbookAndWorksheet({
        absExcel,
        requestedSheetName: args.sheetName,
    });

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Workbook sheets: ${loaded.workbook.worksheets.map((item) => item.name).join(", ")}`,
    });

    const headers = buildScenarioHeaders(loaded);
    const rows = mapScenarioRows(loaded.worksheet, headers);

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Loaded execution sheet: ${loaded.worksheet.name}`,
    });

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Scenario rows loaded: ${rows.length}`,
    });

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Headers: ${headers.filter(Boolean).join(", ")}`,
    });

    return {
        sheetName: loaded.worksheet.name,
        headers,
        rows,
    };
}
