// src/data/builder/plugins/20-build-cases.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import type { CasesFile, DataBuilderContext } from "../types";
import { getSchema } from "../../data-definitions";
import { buildVerticalCases } from "../core/buildVerticalCases";
import { buildTabularCases } from "../core/buildTabularCases";
import { DataBuilderError } from "../errors";
import { createLogEvent, logEvent } from "@logging/log";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

function emitLog(args: {
    scope: string;
    level: "debug" | "info" | "warn" | "error";
    message: string;
}): void {
    logEvent(
        createLogEvent({
            level: args.level,
            category: LOG_CATEGORIES.TECHNICAL,
            message: args.message,
            scope: args.scope,
        })
    );
}

const plugin: PipelinePlugin = {
    name: "build-cases",
    order: 20,
    requires: ["sheet", "meta", "external:excludeEmptyFields", "external:schemaName"],
    provides: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        const meta = ctx.data.meta;
        const scope = ctx.logScope;
        const verbose = !!ctx.data.verbose;

        if (!ws || !meta?.caseMetas?.length) {
            throw new DataBuilderError({
                code: "BUILD_CASES_MISSING_INPUT",
                stage: "build-cases",
                source: "20-build-cases",
                message: "Sheet/meta missing. Ensure prior plugins ran.",
                context: {
                    hasSheet: !!ws,
                    hasMeta: !!meta,
                    caseCount: meta?.caseMetas?.length ?? 0,
                },
            });
        }

        const schema = getSchema(ctx.data.schemaName, ctx.data.sheetName);
        const includeEmpty = !ctx.data.excludeEmptyFields;

        if (verbose) {
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `Building cases with schema "${ctx.data.schemaName}"...`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `layout=${meta.layout}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `includeEmpty=${includeEmpty}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `cases to build=${meta.caseMetas.length}`,
            });
        }

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

        emitLog({
            scope,
            level: LOG_LEVELS.INFO,
            message: `Cases built with schema "${ctx.data.schemaName}": ${cases.length}`,
        });
    },
};

export default plugin;