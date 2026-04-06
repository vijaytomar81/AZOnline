// src/pageActionTools/page-action-validator/validate/report/countValidationIssues.ts

import type { ValidationRuleResult } from "../types";

export function countValidationIssues(results: ValidationRuleResult[]): {
    checksRun: number;
    passedChecks: number;
    warnChecks: number;
    failedChecks: number;
    totalWarnings: number;
    totalErrors: number;
} {
    let warnChecks = 0;
    let failedChecks = 0;
    let totalWarnings = 0;
    let totalErrors = 0;

    results.forEach((result) => {
        const warnings = result.issues.filter((x) => x.level === "warning").length;
        const errors = result.issues.filter((x) => x.level === "error").length;
        totalWarnings += warnings;
        totalErrors += errors;
        if (errors > 0) failedChecks++;
        else if (warnings > 0) warnChecks++;
    });

    return {
        checksRun: results.length,
        passedChecks: results.length - warnChecks - failedChecks,
        warnChecks,
        failedChecks,
        totalWarnings,
        totalErrors,
    };
}
