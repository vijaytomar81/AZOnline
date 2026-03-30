// src/dataLayer/builder/app/printBuilderSummary.ts

import { printSummary, success } from "@utils/cliFormat";
import type { DataBuilderContext } from "../types";

export function printBuilderSummary(args: {
    ctx: DataBuilderContext;
    schemaName: string;
    strictValidation: boolean;
    pluginsExecuted: number;
    totalTime: string;
}): void {
    const { ctx, schemaName, strictValidation, pluginsExecuted, totalTime } = args;

    const absOut = ctx.data.absOut ?? "";
    const caseCount = ctx.data.casesFile?.caseCount ?? 0;

    const validation = ctx.data.validationReport;
    const validationPath = validation?.reportPath ?? "(not generated)";
    const errorCount = validation?.summary.errorCount ?? 0;
    const schemaMissing =
        validation?.summary.missingSchemaFieldsInExcelCount ?? 0;
    const excelMissing =
        validation?.summary.missingExcelFieldsInSchemaCount ?? 0;

    printSummary(
        "DATA BUILDER SUMMARY",
        [
            ["Schema", schemaName],
            ["Strict validation", strictValidation ? "true" : "false"],
            ["Plugins executed", pluginsExecuted],
            ["Cases generated", caseCount],
            ["Test Data Output file", absOut || "(not set)"],
            ["Validation - Report", validationPath],
            ["Validation - Total errors", errorCount],
            [
                "Validation - Warnings - Schema mapping fields missing in Excel",
                schemaMissing,
            ],
            [
                "Validation - Warnings - Excel fields missing in Schema",
                excelMissing,
            ],
            ["Total time", totalTime],
        ],
        success("COMPLETED")
    );
}