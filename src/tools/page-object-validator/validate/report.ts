// src/tools/page-object-validator/validate/report.ts

import { printTree, type TreeNode } from "@/utils/cliTree";
import { ICONS } from "@/utils/icons";
import {
    failure,
    info,
    printSection,
    printSummary,
    strong,
    success,
    warning,
} from "@/utils/cliFormat";
import type {
    ValidationIssue,
    ValidationRunResult,
    ValidationRuleExecutionResult,
} from "./types";

type RuleGroupKey =
    | "environment"
    | "source"
    | "outputs"
    | "pageChain"
    | "manifest"
    | "registry"
    | "hygiene"
    | "conventions"
    | "other";

type RuleGroupBucket = {
    key: RuleGroupKey;
    rules: ValidationRuleExecutionResult[];
};

function countWarnings(issues: ValidationIssue[]): number {
    return issues.filter((x) => x.severity === "WARN").length;
}

function countErrors(issues: ValidationIssue[]): number {
    return issues.filter((x) => x.severity === "ERROR").length;
}

function statusIcon(hasErrors: boolean, hasWarnings: boolean): string {
    if (hasErrors) return failure(ICONS.failIcon);
    if (hasWarnings) return warning(ICONS.warningIcon);
    return success(ICONS.successIcon);
}

function ruleSeverity(hasErrors: boolean, hasWarnings: boolean): "error" | "warning" | "success" {
    if (hasErrors) return "error";
    if (hasWarnings) return "warning";
    return "success";
}

function ruleGroupFromRuleId(ruleId: string): RuleGroupKey {
    if (ruleId.startsWith("environment.")) return "environment";
    if (ruleId.startsWith("source.")) return "source";
    if (ruleId.startsWith("outputs.")) return "outputs";
    if (ruleId.startsWith("pageChain.")) return "pageChain";
    if (ruleId.startsWith("manifest.")) return "manifest";
    if (ruleId.startsWith("registry.")) return "registry";
    if (ruleId.startsWith("hygiene.")) return "hygiene";
    if (ruleId.startsWith("conventions.")) return "conventions";
    return "other";
}

function orderedGroups(perRule: ValidationRuleExecutionResult[]): RuleGroupBucket[] {
    const order: RuleGroupKey[] = [
        "environment",
        "source",
        "outputs",
        "pageChain",
        "manifest",
        "registry",
        "hygiene",
        "conventions",
        "other",
    ];

    const buckets = new Map<RuleGroupKey, ValidationRuleExecutionResult[]>();

    for (const item of perRule) {
        const group = ruleGroupFromRuleId(item.ruleId);
        const current = buckets.get(group) ?? [];
        current.push(item);
        buckets.set(group, current);
    }

    return order
        .map((key) => ({ key, rules: buckets.get(key) ?? [] }))
        .filter((bucket) => bucket.rules.length > 0);
}

function groupSummary(group: RuleGroupBucket) {
    const checks = group.rules.length;
    const warnings = group.rules.reduce((sum, rule) => sum + countWarnings(rule.issues), 0);
    const errors = group.rules.reduce((sum, rule) => sum + countErrors(rule.issues), 0);

    return { checks, warnings, errors };
}

function ruleSummary(rule: ValidationRuleExecutionResult): string {
    const warnings = countWarnings(rule.issues);
    const errors = countErrors(rule.issues);

    if (warnings === 0 && errors === 0) {
        return info("(no issues)");
    }

    return info(`(${warnings} warning(s), ${errors} error(s))`);
}

function groupSummaryText(group: RuleGroupBucket): string {
    const { checks, warnings, errors } = groupSummary(group);
    const checkLabel = checks === 1 ? "check" : "checks";

    if (warnings === 0 && errors === 0) {
        return info(`(${checks} ${checkLabel}, no issues)`);
    }

    return info(`(${checks} ${checkLabel}, ${warnings} warning(s), ${errors} error(s))`);
}

function buildRuleNode(
    groupKey: RuleGroupKey,
    rule: ValidationRuleExecutionResult,
    verbose: boolean
): TreeNode | null {
    const warnings = countWarnings(rule.issues);
    const errors = countErrors(rule.issues);
    const hasIssues = warnings > 0 || errors > 0;

    if (!verbose && !hasIssues) {
        if (groupKey === "pageChain") {
            return {
                severity: "success",
                title: rule.ruleId.replace(/^pageChain\./, ""),
                summary: ruleSummary(rule),
            };
        }

        return null;
    }

    const title =
        groupKey === "pageChain"
            ? rule.ruleId.replace(/^pageChain\./, "")
            : rule.ruleId.replace(/^[^.]+\./, "");

    return {
        severity: ruleSeverity(errors > 0, warnings > 0),
        title,
        summary: ruleSummary(rule),
        children: rule.reportNodes && rule.reportNodes.length > 0 ? rule.reportNodes : undefined,
    };
}

function buildGroupNode(group: RuleGroupBucket, verbose: boolean): TreeNode {
    const { warnings, errors } = groupSummary(group);
    const hasIssues = warnings > 0 || errors > 0;

    if (!verbose && !hasIssues) {
        return {
            severity: "success",
            title: strong(group.key),
            summary: groupSummaryText(group),
        };
    }

    const children = group.rules
        .map((rule) => buildRuleNode(group.key, rule, verbose))
        .filter((node): node is TreeNode => Boolean(node));

    return {
        severity: ruleSeverity(errors > 0, warnings > 0),
        title: strong(group.key),
        summary: groupSummaryText(group),
        children,
    };
}

export function printValidationExecution(
    result: ValidationRunResult,
    verbose = false
): void {
    printSection("Rule execution");

    const nodes = orderedGroups(result.perRule).map((group) => buildGroupNode(group, verbose));
    printTree(nodes);
}

export function printValidationSummary(result: ValidationRunResult): void {
    const summary = result.summary;

    let resultText: string;

    if (summary.totalErrors > 0) {
        resultText = failure("ERROR FOUND");
    } else if (summary.totalWarnings > 0) {
        resultText = warning("WARNING FOUND");
    } else {
        resultText = success("ALL GOOD");
    }

    printSummary(
        "VALIDATE SUMMARY",
        [
            ["Checks run", summary.totalRules],
            ["Passed checks", summary.passedRules],
            ["Warn checks", summary.warnedRules],
            ["Failed checks", summary.failedRules],
            ["Total warnings", summary.totalWarnings],
            ["Total errors", summary.totalErrors],
            ["Exit code", summary.totalErrors > 0 ? 1 : 0],
        ],
        resultText
    );
}