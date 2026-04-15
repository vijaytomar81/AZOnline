// src/dataLayer/builder/plugins/10-extract-meta.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { DataBuilderError } from "../errors";
import { extractTabularMeta } from "../core/extractMeta/extractTabularMeta";
import { extractVerticalMeta } from "../core/extractMeta/extractVerticalMeta";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import {
    logTabularMeta,
    logVerticalMeta,
} from "@dataLayer/builder/core/extractMeta/logExtractedMeta";

const plugin: PipelinePlugin = {
    name: "extract-meta",
    requires: ["sheet"],
    provides: ["meta"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        const scope = ctx.logScope;
        const verbose = !!ctx.data.verbose;

        if (!ws) {
            throw new DataBuilderError({
                code: "SHEET_NOT_LOADED",
                stage: "extract-meta",
                source: "10-extract-meta",
                message: "Sheet not loaded. Ensure load-excel ran.",
            });
        }

        const tabularMeta = extractTabularMeta(ws);
        if (tabularMeta) {
            ctx.data.meta = tabularMeta;
            logTabularMeta({
                scope,
                verbose,
                meta: tabularMeta,
            });
            return;
        }

        const verticalMeta = extractVerticalMeta({
            ws,
            sheetName: ctx.data.sheetName,
        });

        ctx.data.meta = verticalMeta;

        logVerticalMeta({
            scope,
            verbose,
            meta: verticalMeta,
        });
    },
};

export default plugin;