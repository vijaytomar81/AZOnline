// src/pageActionTools/page-action-validator/validate/report/buildValidationReportTree.ts

import type { ValidationRuleResult } from "../types";
import { VALIDATION_REPORT_GROUPS } from "./reportGroups";

function issuesText(result: ValidationRuleResult): string {
    const warnings = result.issues.filter((x) => x.level === "warning").length;
    const errors = result.issues.filter((x) => x.level === "error").length;
    if (errors > 0) return `${errors} error(s)`;
    if (warnings > 0) return `${warnings} warning(s)`;
    return "no issues";
}

export function buildValidationReportTree(
    results: ValidationRuleResult[]
): string[] {
    const lines = ["Rule execution", "--------------"];

    VALIDATION_REPORT_GROUPS.forEach((group) => {
        const groupResults = results.filter((x) => x.category === group);
        if (!groupResults.length) return;

        const warningCount = groupResults.filter((x) =>
            x.issues.some((issue) => issue.level === "warning")
        ).length;
        const errorCount = groupResults.filter((x) =>
            x.issues.some((issue) => issue.level === "error")
        ).length;

        const prefix = errorCount > 0 ? "✖" : warningCount > 0 ? "⚠" : "✔";
        const groupSuffix =
            errorCount > 0
                ? `${groupResults.length} checks, ${errorCount} failed`
                : warningCount > 0
                  ? `${groupResults.length} checks, ${warningCount} warning`
                  : `${groupResults.length} checks, no issues`;

        lines.push(`${prefix} ${group}  (${groupSuffix})`);

        groupResults.forEach((result, index) => {
            const branch = index === groupResults.length - 1 ? "└─" : "├─";
            const icon = result.issues.some((x) => x.level === "error")
                ? "✖"
                : result.issues.some((x) => x.level === "warning")
                  ? "⚠"
                  : "✔";
            lines.push(
                `${branch} ${icon} ${result.name}  (${issuesText(result)})`
            );
        });
    });

    return lines;
}
