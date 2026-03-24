// src/data/builder/plugins/00-load-excel.ts

import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { normalizeSheetKey } from "../../../utils/text";
import { DataBuilderError } from "../errors";

function resolveWorksheet(
    workbook: ExcelJS.Workbook,
    requestedSheetName: string
): ExcelJS.Worksheet {
    const worksheets = Array.isArray(workbook.worksheets) ? workbook.worksheets : [];
    const worksheetNames = worksheets.map((w) => w.name);

    const exact = worksheets.find((w) => w.name === requestedSheetName);
    if (exact) {
        return exact;
    }

    const requestedKey = normalizeSheetKey(requestedSheetName);
    const normalizedMatches = worksheets.filter(
        (w) => normalizeSheetKey(w.name) === requestedKey
    );

    if (normalizedMatches.length === 1) {
        return normalizedMatches[0];
    }

    if (normalizedMatches.length > 1) {
        throw new DataBuilderError({
            code: "WORKSHEET_NAME_AMBIGUOUS",
            stage: "load-excel",
            source: "load-excel",
            message: [
                `Sheet "${requestedSheetName}" is ambiguous after normalization.`,
                ``,
                `Matching sheets found:`,
                ...normalizedMatches.map((w) => `  - ${w.name}`),
                ``,
                `Please pass the exact worksheet name.`,
            ].join("\n"),
            context: {
                requestedSheetName,
                matchingSheets: normalizedMatches.map((w) => w.name).join(", "),
            },
        });
    }

    throw new DataBuilderError({
        code: "WORKSHEET_NOT_FOUND",
        stage: "load-excel",
        source: "load-excel",
        message: `Sheet "${requestedSheetName}" not found. Available: ${worksheetNames.join(", ")}`,
        context: {
            requestedSheetName,
            availableSheets: worksheetNames.join(", "),
        },
    });
}

const plugin: PipelinePlugin = {
    name: "load-excel",
    requires: ["external:excelPath", "external:sheetName"],
    provides: ["workbook", "sheet", "absExcel"],

    run: async (ctx) => {
        const excelPath = String(ctx.data.excelPath ?? "").trim();
        const sheetName = String(ctx.data.sheetName ?? "").trim();

        if (!excelPath) {
            throw new DataBuilderError({
                code: "EXCEL_PATH_MISSING",
                stage: "load-excel",
                source: "load-excel",
                message: "Missing excelPath. Provide --excel (or EXCEL_PATH).",
            });
        }

        if (!sheetName) {
            throw new DataBuilderError({
                code: "SHEET_NAME_MISSING",
                stage: "load-excel",
                source: "load-excel",
                message: "Missing sheetName. Provide --sheet (or SHEET).",
            });
        }

        const absExcel = path.isAbsolute(excelPath)
            ? excelPath
            : path.join(process.cwd(), excelPath);

        if (!fs.existsSync(absExcel)) {
            throw new DataBuilderError({
                code: "EXCEL_FILE_NOT_FOUND",
                stage: "load-excel",
                source: "load-excel",
                message: `Excel file not found: ${absExcel}`,
                context: {
                    excelPath,
                    absExcel,
                },
            });
        }

        const stat = fs.statSync(absExcel);
        if (!stat.isFile()) {
            throw new DataBuilderError({
                code: "EXCEL_PATH_NOT_FILE",
                stage: "load-excel",
                source: "load-excel",
                message: `Excel path is not a file: ${absExcel}`,
                context: {
                    excelPath,
                    absExcel,
                },
            });
        }

        ctx.log.info(`Loading workbook: ${absExcel}`);
        ctx.log.debug?.(`Workbook size: ${stat.size} bytes`);

        const wb = new ExcelJS.Workbook();

        try {
            await wb.xlsx.readFile(absExcel);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new DataBuilderError({
                code: "WORKBOOK_READ_FAILED",
                stage: "load-excel",
                source: "load-excel",
                message: `Failed to read Excel workbook "${absExcel}": ${message}`,
                context: {
                    absExcel,
                },
            });
        }

        const worksheetNames = Array.isArray(wb.worksheets)
            ? wb.worksheets.map((w) => w.name)
            : [];

        ctx.log.debug?.(`Workbook sheets: ${worksheetNames.join(", ") || "(none)"}`);

        if (!worksheetNames.length) {
            throw new DataBuilderError({
                code: "NO_WORKSHEETS_FOUND",
                stage: "load-excel",
                source: "load-excel",
                message: `Workbook loaded but no worksheets were found in: ${absExcel}`,
                context: {
                    absExcel,
                },
            });
        }

        const ws = resolveWorksheet(wb, sheetName);

        ctx.data.workbook = wb;
        ctx.data.sheet = ws;
        ctx.data.absExcel = absExcel;

        ctx.log.info(`Loaded sheet: ${ws.name}`);
    },
};

export default plugin;