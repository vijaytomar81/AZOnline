// src/toolingLayer/businessJourneys/validator/validate/report.ts

import {
    failure,
    info,
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
} from "@utils/cliFormat";
import type {
    ValidationNode,
    ValidationPipelineResult,
    ValidationRuleGroupResult,
} from "./pipeline/types";

function iconFor(severity?: string): string {
    if (severity === "error") return failure("✖");
    if (severity === "warning") return warning("⚠");
    if (severity === "success") return success("✔");
    return info("ℹ");
}

function colorSummary(summary: string | undefined, severity?: string): string {
    if (!summary) return "";
    if (severity === "error") return failure(summary);
    if (severity === "warning") return warning(summary);
    if (severity === "success") return success(summary);
    return info(summary);
}

function colorCount(value: number, label: string, severity: "warning" | "error"): string {
    const text = `${value} ${label}`;

    if (value === 0) {
        return info(text);
    }

    return severity === "error" ? failure(text) : warning(text);
}

function renderGroupSummary(group: ValidationRuleGroupResult): string {
    if (group.warnings === 0 && group.errors === 0) {
        return success("no issues");
    }

    return [
        colorCount(group.warnings, "warning(s)", "warning"),
        colorCount(group.errors, "error(s)", "error"),
    ].join(", ");
}

function renderNode(node: ValidationNode, prefix: string, isLast: boolean): void {
    const branch = isLast ? "└─" : "├─";
    const summary = node.summary
        ? `  (${colorSummary(node.summary, node.severity)})`
        : "";

    console.log(`${prefix}${branch} ${iconFor(node.severity)} ${node.title}${summary}`);

    const children = node.children ?? [];
    const nextPrefix = `${prefix}${isLast ? "   " : "│  "}`;

    children.forEach((child, index) => {
        renderNode(child, nextPrefix, index === children.length - 1);
    });
}

function renderGroup(group: ValidationRuleGroupResult): void {
    const severity =
        group.errors > 0
            ? "error"
            : group.warnings > 0
              ? "warning"
              : "success";

    console.log(
        `${iconFor(severity)} ${group.id}  (${group.checks} check${group.checks === 1 ? "" : "s"}, ${renderGroupSummary(group)})`
    );

    group.nodes.forEach((node, index) => {
        renderNode(node, "", index === group.nodes.length - 1);
    });
}

export function printBusinessJourneyValidatorHeader(): void {
    printCommandTitle("BUSINESS JOURNEY VALIDATOR", "validateIcon");
}

export function printBusinessJourneyValidatorEnvironment(
    rows: Array<[string, string | number | boolean]>
): void {
    printEnvironment(rows);
}

export function printRuleExecution(result: ValidationPipelineResult): void {
    console.log("");
    console.log("Rule execution");
    console.log("--------------");

    result.groups.forEach(renderGroup);
}

export function printValidatorSummary(result: ValidationPipelineResult): void {
    const resultText =
        result.totalErrors > 0
            ? failure("INVALID")
            : result.totalWarnings > 0
              ? warning("WARNINGS FOUND")
              : success("ALL GOOD");

    printSummary(
        "VALIDATE SUMMARY",
        [
            ["Checks run", result.checksRun],
            ["Passed checks", result.passedChecks],
            ["Warn checks", result.warnChecks],
            ["Failed checks", result.failedChecks],
            ["Total warnings", result.totalWarnings],
            ["Total errors", result.totalErrors],
            ["Exit code", result.totalErrors > 0 ? 1 : 0],
        ],
        resultText
    );
}
