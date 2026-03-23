// src/data/builder/plugins/20-build-cases.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import type { CasesFile, DataBuilderContext } from "../types";
import { getSchema } from "../../data-definitions";
import { buildVerticalCases } from "../core/buildVerticalCases";
import { buildTabularCases } from "../core/buildTabularCases";

const plugin: PipelinePlugin = {
    name: "build-cases",
    order: 20,
    requires: ["sheet", "meta", "external:excludeEmptyFields", "external:schemaName"],
    provides: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        const meta = ctx.data.meta;

        if (!ws || !meta?.caseMetas?.length) {
            throw new Error("Sheet/meta missing. Ensure prior plugins ran.");
        }

        const schema = getSchema(ctx.data.schemaName, ctx.data.sheetName);
        const includeEmpty = !ctx.data.excludeEmptyFields;

        ctx.log.info(`Building cases with schema "${ctx.data.schemaName}"...`);
        ctx.log.debug?.(`layout=${meta.layout}`);
        ctx.log.debug?.(`includeEmpty=${includeEmpty}`);
        ctx.log.debug?.(`cases to build=${meta.caseMetas.length}`);

        const cases =
            meta.layout === "tabular"
                ? buildTabularCases({ ctx, ws, meta, schema, includeEmpty })
                : buildVerticalCases({ ctx, ws, meta, schema, includeEmpty });

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