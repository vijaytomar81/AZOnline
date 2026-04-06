// src/pageActionTools/page-action-validator/validate/report/buildValidationReportTree.ts

import {
    failure,
    info,
    muted,
    success,
    warning,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import type { ValidationIssue, ValidationRuleResult } from "../types";
import { VALIDATION_REPORT_GROUPS } from "./reportGroups";

function issuesText(result: ValidationRuleResult): string {
    const warnings = result.issues.filter((x) => x.level === "warning").length;
    const errors = result.issues.filter((x) => x.level === "error").length;

    if (errors > 0) {
        return failure(`(${errors} error(s))`);
    }

    if (warnings > 0) {
        return warning(`(${warnings} warning(s))`);
    }

    return info("(no issues)");
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

function buildGroupSuffix(args: {
    totalChecks: number;
    errorCount: number;
    warningCount: number;
}): string {
    const label = checkLabel(args.totalChecks);

    if (args.errorCount > 0) {
        return failure(`(${args.totalChecks} ${label}, ${args.errorCount} failed)`);
    }

    if (args.warningCount > 0) {
        return warning(`(${args.totalChecks} ${label}, ${args.warningCount} warning)`);
    }

    return info(`(${args.totalChecks} ${label}, no issues)`);
}

function formatIssueValue(args: {
    issue: ValidationIssue;
    value: string;
    kind: "actual" | "correct";
}): string {
    if (args.kind === "actual") {
        return args.issue.level === "warning"
            ? warning(args.value)
            : failure(args.value);
    }

    return success(args.value);
}

function buildIssueDetailLines(args: {
    issue: ValidationIssue;
    issueIndex: number;
    issueCount: number;
    parentPrefix: string;
}): string[] {
    const lines: string[] = [];
    const key = args.issue.key ?? args.issue.message;
    const issueIcon =
        args.issue.level === "warning"
            ? warning(ICONS.warningIcon)
            : failure(ICONS.failIcon);

    const issueBranch = args.issueIndex === args.issueCount - 1 ? "└─" : "├─";
    const detailIndent = `${args.parentPrefix}${args.issueIndex === args.issueCount - 1 ? "   " : "│  "}`;

    lines.push(`${args.parentPrefix}${issueBranch} ${issueIcon} ${key}`);

    if (args.issue.meta?.filePath) {
        lines.push(
            `${detailIndent}${muted("file".padEnd(14))}: ${args.issue.meta.filePath}`
        );
    }

    if (args.issue.meta?.actual !== undefined) {
        lines.push(
            `${detailIndent}${muted("actual value".padEnd(14))}: ${formatIssueValue({
                issue: args.issue,
                value: args.issue.meta.actual,
                kind: "actual",
            })}`
        );
    }

    if (args.issue.meta?.expected !== undefined) {
        lines.push(
            `${detailIndent}${muted("correct value".padEnd(14))}: ${formatIssueValue({
                issue: args.issue,
                value: args.issue.meta.expected,
                kind: "correct",
            })}`
        );
    }

    if (args.issue.message) {
        lines.push(
            `${detailIndent}${muted("message".padEnd(14))}: ${args.issue.message}`
        );
    }

    lines.push("");

    return lines;
}

export function buildValidationReportTree(
    results: ValidationRuleResult[],
    verbose: boolean
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

        lines.push(
            `${groupIcon} ${group}  ${buildGroupSuffix({
                totalChecks: groupResults.length,
                errorCount,
                warningCount,
            })}`
        );

        groupResults.forEach((result, index) => {
            const branch = index === groupResults.length - 1 ? "└─" : "├─";

            const hasErrors = result.issues.some((x) => x.level === "error");
            const hasWarnings = result.issues.some((x) => x.level === "warning");

            const ruleIcon = colorStatusIcon({
                hasErrors,
                hasWarnings: !hasErrors && hasWarnings,
            });

            lines.push(
                `${branch} ${ruleIcon} ${result.name}  ${issuesText(result)}`
            );

            if (result.issues.length > 0) {
                const parentPrefix = index === groupResults.length - 1 ? "   " : "│  ";

                result.issues.forEach((issue, issueIndex) => {
                    lines.push(
                        ...buildIssueDetailLines({
                            issue,
                            issueIndex,
                            issueCount: result.issues.length,
                            parentPrefix,
                        })
                    );
                });
            }
        });
    });

    return lines;
}
