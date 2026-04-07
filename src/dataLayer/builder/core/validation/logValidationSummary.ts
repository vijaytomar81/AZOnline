// src/dataLayer/builder/core/validation/logValidationSummary.ts

import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import type { ValidationReport } from "../../types";

export function logValidationSummary(args: {
    scope: string;
    report: ValidationReport;
}): void {
    const { scope, report } = args;

    emitLog({ scope, level: LOG_LEVELS.DEBUG, category: LOG_CATEGORIES.VALIDATION, message: "Validation Summary" });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message: `Schema: ${report.schemaName}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message: `Sheet: ${report.sheetName}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message: `Errors: ${report.summary.errorCount}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message: "Missing Schema Fields in Excel",
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message:
            `  Required fields missing: ` +
            `${report.missingSchemaFieldsInExcel.requiredFields.length}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message:
            `  Total missing fields: ` +
            `${report.summary.missingSchemaFieldsInExcelCount}`,
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message: "Missing Excel Fields in Schema",
    });
    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message:
            `  Unmapped fields: ` +
            `${report.summary.missingExcelFieldsInSchemaCount}`,
    });

    const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);
    if (!sections.length) {
        return;
    }

    emitLog({
        scope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.VALIDATION,
        message: "  By section:",
    });

    sections.forEach(([section, data]) => {
        const total =
            data.requiredFields.length + data.schemaMappingFields.length;

        emitLog({
            scope,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.VALIDATION,
            message: `    ${section}: ${total}`,
        });
    });
}