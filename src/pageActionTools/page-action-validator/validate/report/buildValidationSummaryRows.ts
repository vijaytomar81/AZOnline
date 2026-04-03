// src/pageActionTools/page-action-validator/validate/report/buildValidationSummaryRows.ts

import type { ValidationRuleResult } from "../types";
import { countValidationIssues } from "./countValidationIssues";

export function buildValidationSummaryRows(results: ValidationRuleResult[]): {
    rows: Array<[string, string | number]>;
    exitCode: number;
    resultText: string;
} {
    const counts = countValidationIssues(results);
    const exitCode = counts.totalErrors > 0 ? 1 : 0;

    const resultText =
        counts.totalErrors > 0
            ? "ISSUES FOUND"
            : counts.totalWarnings > 0
              ? "WARNINGS FOUND"
              : "ALL GOOD";

    return {
        rows: [
            ["Checks run", counts.checksRun],
            ["Passed checks", counts.passedChecks],
            ["Warn checks", counts.warnChecks],
            ["Failed checks", counts.failedChecks],
            ["Total warnings", counts.totalWarnings],
            ["Total errors", counts.totalErrors],
            ["Exit code", exitCode],
        ],
        exitCode,
        resultText,
    };
}
