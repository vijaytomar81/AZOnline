// src/executionLayer/runtime/scenarioSheet/loadScenarioSheet.ts

import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { getWorksheet, readWorkbook } from "@utils/fileFormats/excel";
import { buildScenarioHeaders } from "./buildScenarioHeaders";
import { ensureScenarioExcelExists } from "./ensureScenarioExcelExists";
import { mapScenarioRows } from "./mapScenarioRows";
import { resolveScenarioExcelPath } from "./resolveScenarioExcelPath";
import type { LoadScenarioSheetResult } from "./types";

export async function loadScenarioSheet(args: {
    excelPath: string;
    sheetName: string;
    logScope: string;
}): Promise<LoadScenarioSheetResult> {
    const absExcelPath = resolveScenarioExcelPath(args.excelPath);
    ensureScenarioExcelExists(absExcelPath, args.excelPath);

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Loading execution workbook: ${absExcelPath}`,
    });

    const workbook = await readWorkbook(absExcelPath);
    const worksheet = getWorksheet(workbook, args.sheetName);

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Workbook sheets: ${workbook.worksheets.map((item) => item.name).join(", ")}`,
    });

    const headers = buildScenarioHeaders(worksheet);
    const rows = mapScenarioRows({
        worksheet,
        headers,
    });

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Loaded execution sheet: ${worksheet.name}`,
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
        sheetName: worksheet.name,
        headers,
        rows,
    };
}
