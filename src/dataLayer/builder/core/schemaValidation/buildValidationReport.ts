// src/dataLayer/builder/core/schemaValidation/buildValidationReport.ts

import type { SectionFieldGroup, ValidationReport } from "../../types";
import { countMissingSchemaFields } from "./computeMissingFields";

export function buildValidationReport(args: {
    schemaName: string;
    sheetName: string;
    strict: boolean;
    errors: string[];
    requiredMissing: string[];
    bySection: Record<string, SectionFieldGroup>;
    unmappedExcel: string[];
}): ValidationReport {
    const mode: "normal" | "strict" = args.strict ? "strict" : "normal";

    return {
        schemaName: args.schemaName,
        sheetName: args.sheetName,
        mode,
        generatedAt: new Date().toISOString(),
        errors: args.errors,
        missingSchemaFieldsInExcel: {
            requiredFields: args.requiredMissing,
            bySection: args.bySection,
        },
        missingExcelFieldsInSchema: {
            unusedExcelFields: args.unmappedExcel,
        },
        summary: {
            errorCount: args.errors.length,
            missingSchemaFieldsInExcelCount: countMissingSchemaFields(args.bySection),
            missingExcelFieldsInSchemaCount: args.unmappedExcel.length,
        },
    };
}