// src/tools/pageObjects/validator/validate/report/buildValidationSummaryRows.ts

import type { ValidationSummary } from "../types";

export function buildValidationSummaryRows(
    summary: ValidationSummary
): Array<[string, string | number]> {
    return [
        ["Checks run", summary.totalRules],
        ["Passed checks", summary.passedRules],
        ["Warn checks", summary.warnedRules],
        ["Failed checks", summary.failedRules],
        ["Total warnings", summary.totalWarnings],
        ["Total errors", summary.totalErrors],
        ["Exit code", summary.totalErrors > 0 ? 1 : 0],
    ];
}