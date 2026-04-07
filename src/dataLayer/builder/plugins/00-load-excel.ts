// src/dataLayer/builder/plugins/00-load-excel.ts

import type { PipelinePlugin } from "../core/pipeline";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { resolveExcelPath } from "../core/loadExcel/resolveExcelPath";
import { loadWorkbook } from "../core/loadExcel/loadWorkbook";
import { resolveWorksheet } from "../core/loadExcel/resolveWorksheet";

const plugin: PipelinePlugin = {
    name: "load-excel",
    requires: ["external:excelPath", "external:sheetName"],
    provides: ["workbook", "sheet", "absExcel"],

    run: async (ctx) => {
        const excelPath = String(ctx.data.excelPath ?? "").trim();
        const sheetName = String(ctx.data.sheetName ?? "").trim();
        const logScope = ctx.logScope;

        const { absExcel, sizeBytes } = resolveExcelPath(excelPath);

        emitLog({
            scope: logScope,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Loading workbook: ${absExcel}`,
        });

        emitLog({
            scope: logScope,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Workbook size: ${sizeBytes} bytes`,
        });

        const workbook = await loadWorkbook(absExcel);
        const worksheetNames = workbook.worksheets.map((worksheet) => worksheet.name);

        emitLog({
            scope: logScope,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Workbook sheets: ${worksheetNames.join(", ") || "(none)"}`,
        });

        const worksheet = resolveWorksheet(workbook, sheetName);

        ctx.data.workbook = workbook;
        ctx.data.sheet = worksheet;
        ctx.data.absExcel = absExcel;

        emitLog({
            scope: logScope,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Loaded sheet: ${worksheet.name}`,
        });
    },
};

export default plugin;