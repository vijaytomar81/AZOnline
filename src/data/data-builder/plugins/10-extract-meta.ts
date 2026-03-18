// src/data/data-builder/plugins/10-extract-meta.ts
import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import {
    cellToString,
    detectCaseColumns,
    detectLayout,
    findRowByField,
    norm,
} from "../core/excelRuntime";

const plugin: PipelinePlugin = {
    name: "extract-meta",
    requires: ["sheet"],
    provides: ["meta"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        if (!ws) throw new Error("Sheet not loaded. Ensure load-excel ran.");

        const layout = detectLayout(ws);
        const scriptIdRow = findRowByField(ws, layout.fieldCol, layout.dataStartRow, ["ScriptId", "Script ID"]);
        const scriptNameRow = findRowByField(ws, layout.fieldCol, layout.dataStartRow, ["ScriptName"]);
        const caseCols = detectCaseColumns(ws, scriptIdRow, layout.caseStartCol);

        ctx.data.meta = {
            sheet: String(ctx.data.sheetName ?? ws.name ?? "").trim() || "Sheet",
            scriptIdRow,
            scriptNameRow,
            fieldCol: layout.fieldCol,
            caseStartCol: layout.caseStartCol,
            dataStartRow: layout.dataStartRow,
            caseMetas: caseCols.map((col) => ({
                col,
                scriptId: norm(cellToString(ws.getCell(scriptIdRow, col).value)),
                scriptName: norm(cellToString(ws.getCell(scriptNameRow, col).value)),
            })),
        };

        ctx.log.info(`Metadata extracted. Cases detected: ${ctx.data.meta.caseMetas.length}`);
    },
};

export default plugin;