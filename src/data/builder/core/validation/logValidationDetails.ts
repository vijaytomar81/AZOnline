// src/data/builder/core/validation/logValidationDetails.ts

import { emitLog } from "@data/builder/logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import type { ValidationReport } from "../../types";

export function logValidationDetails(args: {
    scope: string;
    report: ValidationReport;
}): void {
    const { scope, report } = args;
    const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);

    sections.forEach(([section, data]) => {
        data.requiredFields.slice(0, 10).forEach((field) => {
            emitLog({
                scope,
                level: LOG_LEVELS.WARN,
                category: LOG_CATEGORIES.VALIDATION,
                message: `[${section}] Missing required field: ${field}`,
            });
        });

        data.schemaMappingFields.slice(0, 10).forEach((field) => {
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                category: LOG_CATEGORIES.VALIDATION,
                message: `[${section}] Missing mapped field: ${field}`,
            });
        });
    });

    report.missingExcelFieldsInSchema.unusedExcelFields
        .slice(0, 10)
        .forEach((field) => {
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                category: LOG_CATEGORIES.TECHNICAL,
                message: `Unused Excel field: ${field}`,
            });
        });
}