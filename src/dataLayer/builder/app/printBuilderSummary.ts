// src/dataLayer/builder/app/printBuilderSummary.ts

import path from "node:path";
import { printSummary, success } from "@utils/cliFormat";
import { toRepoRelative } from "@utils/paths";
import type { DataBuilderContext } from "../types";

function toDisplayPath(filePath?: string): string {
    if (!filePath || filePath === "(not generated)") {
        return filePath || "(not generated)";
    }

    return toRepoRelative(filePath);
}

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
            ["Test Data Output file", absOut ? toDisplayPath(absOut) : "(not set)"],
            ["Validation - Report", toDisplayPath(validationPath)],
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
