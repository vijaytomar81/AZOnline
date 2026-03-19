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
        const scriptIdRow = findRowByField(
            ws,
            layout.fieldCol,
            layout.dataStartRow,
            ["ScriptId", "Script ID"]
        );
        const scriptNameRow = findRowByField(
            ws,
            layout.fieldCol,
            layout.dataStartRow,
            ["ScriptName"]
        );
        const caseCols = detectCaseColumns(ws, scriptIdRow, layout.caseStartCol);

        const caseMetas = caseCols.map((col) => ({
            col,
            scriptId: norm(cellToString(ws.getCell(scriptIdRow, col).value)),
            scriptName: norm(cellToString(ws.getCell(scriptNameRow, col).value)),
        }));

        ctx.data.meta = {
            sheet: String(ctx.data.sheetName ?? ws.name ?? "").trim() || "Sheet",
            scriptIdRow,
            scriptNameRow,
            fieldCol: layout.fieldCol,
            caseStartCol: layout.caseStartCol,
            dataStartRow: layout.dataStartRow,
            caseMetas,
        };

        ctx.log.info(`Metadata extracted. Cases detected: ${caseMetas.length}`);
        ctx.log.debug?.(`Detected layout -> dataStartRow=${layout.dataStartRow}`);
        ctx.log.debug?.(`Detected layout -> fieldCol=${layout.fieldCol}`);
        ctx.log.debug?.(`Detected layout -> caseStartCol=${layout.caseStartCol}`);
        ctx.log.debug?.(`ScriptId row=${scriptIdRow}`);
        ctx.log.debug?.(`ScriptName row=${scriptNameRow}`);
        ctx.log.debug?.(`Case columns detected=${caseCols.length}`);

        caseMetas.forEach((m) => {
            ctx.log.debug?.(
                `Case meta -> col=${m.col}, scriptId=${m.scriptId}, scriptName=${m.scriptName}`
            );
        });
    },
};

export default plugin;