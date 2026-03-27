// src/data/builder/plugins/05-validate-schema.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { getSchema } from "../../data-definitions";
import { detectLayout } from "../core/excelRuntime";
import { validateTabularSchema } from "../core/validateTabularSchema";
import { validateVerticalSchema } from "../core/validateVerticalSchema";
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

function logValidationSummary(ctx: Parameters<PipelinePlugin["run"]>[0]): void {
    const report = ctx.data.validationReport;
    if (!report) return;

    const scope = ctx.logScope;

    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: "Validation Summary",
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: `Schema: ${report.schemaName}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: `Sheet: ${report.sheetName}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: `Errors: ${report.summary.errorCount}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: "Missing Schema Fields in Excel",
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: `  Required fields missing: ${report.missingSchemaFieldsInExcel.requiredFields.length}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: `  Total missing fields: ${report.summary.missingSchemaFieldsInExcelCount}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: "Missing Excel Fields in Schema",
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        message: `  Unmapped fields: ${report.summary.missingExcelFieldsInSchemaCount}`,
    });

    const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);
    if (sections.length) {
        emitLog({
            scope,
            level: LOG_LEVELS.DEBUG,
            message: "  By section:",
        });

        sections.forEach(([section, data]) => {
            const total = data.requiredFields.length + data.schemaMappingFields.length;
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `    ${section}: ${total}`,
            });
        });
    }
}

function logVerboseDetails(ctx: Parameters<PipelinePlugin["run"]>[0]) {
    const report = ctx.data.validationReport;
    if (!report) return;

    const scope = ctx.logScope;
    const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);

    sections.forEach(([section, data]) => {
        data.requiredFields.slice(0, 10).forEach((field) =>
            emitLog({
                scope,
                level: LOG_LEVELS.WARN,
                message: `[${section}] Missing required field: ${field}`,
            })
        );

        data.schemaMappingFields.slice(0, 10).forEach((field) =>
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `[${section}] Missing mapped field: ${field}`,
            })
        );
    });

    report.missingExcelFieldsInSchema.unusedExcelFields
        .slice(0, 10)
        .forEach((field) =>
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `Unused Excel field: ${field}`,
            })
        );
}

const plugin: PipelinePlugin = {
    name: "validate-schema",
    order: 5,
    requires: ["sheet", "external:schemaName", "external:strictValidation"],
    provides: ["validationReport"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet;
        if (!ws) {
            throw new DataBuilderError({
                code: "SHEET_NOT_LOADED",
                stage: "validate-schema",
                source: "05-validate-schema",
                message: "Sheet not loaded.",
            });
        }

        const strict = !!ctx.data.strictValidation;
        const verbose = !!ctx.data.verbose;
        const schema = getSchema(ctx.data.schemaName, ctx.data.sheetName);

        const report =
            ctx.data.schemaName === "pcw_tool"
                ? validateTabularSchema({
                    ws,
                    schema,
                    schemaName: ctx.data.schemaName,
                    sheetName: ctx.data.sheetName,
                    strict,
                })
                : (() => {
                    const layout = detectLayout(ws);
                    return validateVerticalSchema({
                        ws,
                        schema,
                        schemaName: ctx.data.schemaName,
                        sheetName: ctx.data.sheetName,
                        strict,
                        fieldCol: layout.fieldCol,
                        dataStartRow: layout.dataStartRow,
                    });
                })();

        ctx.data.validationReport = report;

        if (verbose) {
            logValidationSummary(ctx);
        }

        if (report.errors.length) {
            report.errors.slice(0, 20).forEach((error) =>
                emitLog({
                    scope: ctx.logScope,
                    level: LOG_LEVELS.ERROR,
                    message: error,
                })
            );

            throw new DataBuilderError({
                code: "SCHEMA_VALIDATION_FAILED",
                stage: "validate-schema",
                source: "05-validate-schema",
                message: "Schema validation failed.",
                context: {
                    schemaName: ctx.data.schemaName,
                    sheetName: ctx.data.sheetName,
                    errorCount: report.errors.length,
                },
            });
        }

        if (verbose) {
            logVerboseDetails(ctx);
        }

        emitLog({
            scope: ctx.logScope,
            level: LOG_LEVELS.INFO,
            message: "Validation completed ✅",
        });
    },
};

export default plugin;