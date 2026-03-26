// src/data/builder/plugins/05-validate-schema.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { getSchema } from "../../data-definitions";
import { detectLayout } from "../core/excelRuntime";
import { validateTabularSchema } from "../core/validateTabularSchema";
import { validateVerticalSchema } from "../core/validateVerticalSchema";
import { DataBuilderError } from "../errors";

function logValidationSummary(
    ctx: Parameters<PipelinePlugin["run"]>[0],
    verbose: boolean
) {
    const report = ctx.data.validationReport;
    if (!report) return;

    ctx.log.info("Validation Summary");
    ctx.log.info(`Schema: ${report.schemaName}`);
    ctx.log.info(`Sheet: ${report.sheetName}`);
    ctx.log.info(`Errors: ${report.summary.errorCount}`);
    ctx.log.info("Missing Schema Fields in Excel");
    ctx.log.info(
        `  Required fields missing: ${report.missingSchemaFieldsInExcel.requiredFields.length}`
    );
    ctx.log.info(`  Total missing fields: ${report.summary.missingSchemaFieldsInExcelCount}`);
    ctx.log.info("Missing Excel Fields in Schema");
    ctx.log.info(`  Unmapped fields: ${report.summary.missingExcelFieldsInSchemaCount}`);

    if (!verbose) return;

    const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);
    if (sections.length) {
        ctx.log.info("  By section:");
        sections.forEach(([section, data]) => {
            const total = data.requiredFields.length + data.schemaMappingFields.length;
            ctx.log.info(`    ${section}: ${total}`);
        });
    }
}

function logVerboseDetails(ctx: Parameters<PipelinePlugin["run"]>[0]) {
    const report = ctx.data.validationReport;
    if (!report) return;

    const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);

    sections.forEach(([section, data]) => {
        data.requiredFields
            .slice(0, 10)
            .forEach((field) => ctx.log.warn(`[${section}] Missing required field: ${field}`));

        data.schemaMappingFields
            .slice(0, 10)
            .forEach((field) => ctx.log.debug?.(`[${section}] Missing mapped field: ${field}`));
    });

    report.missingExcelFieldsInSchema.unusedExcelFields
        .slice(0, 10)
        .forEach((field) => ctx.log.debug?.(`Unused Excel field: ${field}`));
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

        logValidationSummary(ctx, verbose);

        if (report.errors.length) {
            report.errors.slice(0, 20).forEach((error) => ctx.log.error(error));
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

        ctx.log.info("Validation completed ✅");
    },
};

export default plugin;