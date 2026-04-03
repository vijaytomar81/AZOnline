// src/pageActionTools/page-action-validator/validate/report/buildValidationReportTree.ts

import {
    failure,
    success,
    warning,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import type { ValidationRuleResult } from "../types";
import { VALIDATION_REPORT_GROUPS } from "./reportGroups";

function issuesText(result: ValidationRuleResult): string {
    const warnings = result.issues.filter((x) => x.level === "warning").length;
    const errors = result.issues.filter((x) => x.level === "error").length;

    if (errors > 0) {
        return `${errors} error(s)`;
    }

    if (warnings > 0) {
        return `${warnings} warning(s)`;
    }

    return "no issues";
}

function checkLabel(count: number): string {
    return count === 1 ? "check" : "checks";
}

function colorStatusIcon(args: {
    hasErrors: boolean;
    hasWarnings: boolean;
}): string {
    if (args.hasErrors) {
        return failure(ICONS.failIcon);
    }

    if (args.hasWarnings) {
        return warning(ICONS.warningIcon);
    }

    return success(ICONS.successIcon);
}

export function buildValidationReportTree(
    results: ValidationRuleResult[]
): string[] {
    const lines = ["Rule execution", "--------------"];

    VALIDATION_REPORT_GROUPS.forEach((group) => {
        const groupResults = results.filter((x) => x.category === group);

        if (!groupResults.length) {
            return;
        }

        const warningCount = groupResults.filter((x) =>
            x.issues.some((issue) => issue.level === "warning")
        ).length;

        const errorCount = groupResults.filter((x) =>
            x.issues.some((issue) => issue.level === "error")
        ).length;

        const groupIcon = colorStatusIcon({
            hasErrors: errorCount > 0,
            hasWarnings: errorCount === 0 && warningCount > 0,
        });

        const groupSuffix =
            errorCount > 0
                ? `${groupResults.length} ${checkLabel(groupResults.length)}, ${errorCount} failed`
                : warningCount > 0
                  ? `${groupResults.length} ${checkLabel(groupResults.length)}, ${warningCount} warning`
                  : `${groupResults.length} ${checkLabel(groupResults.length)}, no issues`;

        lines.push(`${groupIcon} ${group}  (${groupSuffix})`);

        groupResults.forEach((result, index) => {
            const branch = index === groupResults.length - 1 ? "└─" : "├─";

            const hasErrors = result.issues.some((x) => x.level === "error");
            const hasWarnings = result.issues.some((x) => x.level === "warning");

            const ruleIcon = colorStatusIcon({
                hasErrors,
                hasWarnings: !hasErrors && hasWarnings,
            });

            lines.push(
                `${branch} ${ruleIcon} ${result.name}  (${issuesText(result)})`
            );
        });
    });

    return lines;
}
