// src/data/data-builder/plugins/00-load-excel.ts

import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";

const plugin: PipelinePlugin = {
    name: "load-excel",

    // These come from CLI (initial ctx.data), not from other plugins
    requires: ["external:excelPath", "external:sheetName"],

    // These keys will be produced for other plugins
    provides: ["workbook", "sheet", "absExcel"],

    run: async (ctx) => {
        const excelPath = String(ctx.data.excelPath ?? "").trim();
        const sheetName = String(ctx.data.sheetName ?? "").trim();

        if (!excelPath) {
            throw new Error("Missing excelPath. Provide --excel (or EXCEL_PATH).");
        }

        if (!sheetName) {
            throw new Error("Missing sheetName. Provide --sheet (or SHEET).");
        }

        const absExcel = path.isAbsolute(excelPath)
            ? excelPath
            : path.join(process.cwd(), excelPath);

        if (!fs.existsSync(absExcel)) {
            throw new Error(`Excel file not found: ${absExcel}`);
        }

        // Keep INFO logs minimal; heavy details should go to debug.
        ctx.log.info(`Loading workbook: ${absExcel}`);

        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(absExcel);

        const ws = wb.getWorksheet(sheetName);
        if (!ws) {
            const available = wb.worksheets.map((w) => w.name).join(", ");
            throw new Error(`Sheet "${sheetName}" not found. Available: ${available}`);
        }

        // Set outputs for downstream plugins
        ctx.data.workbook = wb;
        ctx.data.sheet = ws;
        ctx.data.absExcel = absExcel;

        ctx.log.info(`Loaded sheet: ${ws.name}`);
        ctx.log.debug?.(`Workbook sheets: ${wb.worksheets.map((w) => w.name).join(", ")}`);
    },
};

export default plugin;