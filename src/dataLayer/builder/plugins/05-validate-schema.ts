// src/dataLayer/builder/plugins/05-validate-schema.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { DataBuilderError } from "../errors";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { runSchemaValidation } from "../core/validation/runSchemaValidation";
import { logValidationSummary } from "../core/validation/logValidationSummary";
import { logValidationDetails } from "../core/validation/logValidationDetails";
import { detectLayout } from "../core/spreadsheet/detectLayout";

const plugin: PipelinePlugin = {
    name: "validate-schema",
    order: 5,
    requires: ["sheet", "external:schemaName", "external:strictValidation"],
    provides: ["validationReport"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        if (!ws) {
            throw new DataBuilderError({
                code: "SHEET_NOT_LOADED",
                stage: "validate-schema",
                source: "05-validate-schema",
                message: "Sheet not loaded.",
            });
        }

        const layout = detectLayout(ws);

        const report = runSchemaValidation({
            ws,
            schemaName: ctx.data.schemaName,
            sheetName: ctx.data.sheetName,
            platform: ctx.data.platform,
            journeyContext: ctx.data.journeyContext,
            layout,
            strict: !!ctx.data.strictValidation,
        });

        ctx.data.validationReport = report;

        if (ctx.data.verbose) {
            logValidationSummary({
                scope: ctx.logScope,
                report,
            });
        }

        if (report.errors.length) {
            report.errors.slice(0, 20).forEach((error) => {
                emitLog({
                    scope: ctx.logScope,
                    level: LOG_LEVELS.ERROR,
                    category: LOG_CATEGORIES.VALIDATION,
                    message: error,
                });
            });

            throw new DataBuilderError({
                code: "SCHEMA_VALIDATION_FAILED",
                stage: "validate-schema",
                source: "05-validate-schema",
                message: "Schema validation failed.",
                context: {
                    schemaName: ctx.data.schemaName,
                    sheetName: ctx.data.sheetName,
                    platform: ctx.data.platform,
                    application: ctx.data.application,
                    product: ctx.data.product,
                    journeyContext: ctx.data.journeyContext,
                    errorCount: report.errors.length,
                },
            });
        }

        if (ctx.data.verbose) {
            logValidationDetails({
                scope: ctx.logScope,
                report,
            });
        }

        emitLog({
            scope: ctx.logScope,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.VALIDATION,
            message: "Validation completed ✅",
        });
    },
};

export default plugin;