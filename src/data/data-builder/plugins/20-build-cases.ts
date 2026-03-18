// src/data/data-builder/plugins/20-build-cases.ts
import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import type { BuiltCase, CasesFile, DataBuilderContext } from "../types";
import { buildRowIndex } from "../core/excelRuntime";
import { buildPayload } from "../core/schemaRuntime";
import { getSchema } from "../../input-data-schema";

const plugin: PipelinePlugin = {
    name: "build-cases",
    order: 20,
    requires: ["sheet", "meta", "external:includeEmptyChildFields", "external:schemaName"],
    provides: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        const meta = ctx.data.meta;
        if (!ws || !meta?.caseMetas?.length) throw new Error("Sheet/meta missing. Ensure prior plugins ran.");

        const schema = getSchema(ctx.data.schemaName);
        const includeEmpty = !ctx.data.excludeEmptyFields;
        const rowIndex = buildRowIndex(ws, meta.fieldCol, meta.dataStartRow);

        const cases: BuiltCase[] = meta.caseMetas.map((m, idx) => {
            const data = buildPayload(schema, {
                ws,
                col: m.col,
                rowIndex,
                includeEmpty,
            });

            const description = String(data.meta?.description ?? "").trim() || undefined;
            return {
                caseIndex: idx + 1,
                scriptName: m.scriptName,
                scriptId: m.scriptId,
                description,
                data,
            };
        });

        const casesFile: CasesFile = {
            sheet: String(ctx.data.sheetName ?? ws.name ?? "").trim() || "Sheet",
            sourceExcel: String(ctx.data.absExcel ?? ctx.data.excelPath ?? "").trim(),
            generatedAt: new Date().toISOString(),
            caseCount: cases.length,
            cases,
        };

        ctx.data.casesFile = casesFile;
        ctx.log.info(`Cases built with schema "${ctx.data.schemaName}": ${cases.length}`);
    },
};

export default plugin;