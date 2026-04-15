// src/toolingLayer/pageObjects/validator/validate/report/buildValidationReportTree.ts

import type { TreeNode } from "@utils/cliTree";
import { info, strong } from "@utils/cliFormat";
import {
    VALIDATION_REPORT_SEVERITIES,
    type ValidationReportSeverity,
} from "@configLayer/tooling/validation";
import type { ValidationRuleExecutionResult } from "../types";
import {
    countValidationErrors,
    countValidationWarnings,
} from "./countValidationIssues";
import { orderedValidationGroups, type RuleGroupBucket } from "./reportGroups";

function ruleSeverity(
    hasErrors: boolean,
    hasWarnings: boolean
): ValidationReportSeverity {
    if (hasErrors) return VALIDATION_REPORT_SEVERITIES.ERROR;
    if (hasWarnings) return VALIDATION_REPORT_SEVERITIES.WARNING;
    return VALIDATION_REPORT_SEVERITIES.SUCCESS;
}

function buildRuleSummary(rule: ValidationRuleExecutionResult): string {
    const warnings = countValidationWarnings(rule.issues);
    const errors = countValidationErrors(rule.issues);

    if (warnings === 0 && errors === 0) {
        return info("(no issues)");
    }

    return info(`(${warnings} warning(s), ${errors} error(s))`);
}

function buildGroupSummary(group: RuleGroupBucket): string {
    const checks = group.rules.length;
    const warnings = group.rules.reduce(
        (sum, rule) => sum + countValidationWarnings(rule.issues),
        0
    );
    const errors = group.rules.reduce(
        (sum, rule) => sum + countValidationErrors(rule.issues),
        0
    );
    const checkLabel = checks === 1 ? "check" : "checks";

    if (warnings === 0 && errors === 0) {
        return info(`(${checks} ${checkLabel}, no issues)`);
    }

    return info(
        `(${checks} ${checkLabel}, ${warnings} warning(s), ${errors} error(s))`
    );
}

function buildRuleTitle(
    groupKey: RuleGroupBucket["key"],
    ruleId: string
): string {
    if (groupKey === "pageChain") {
        return ruleId.replace(/^pageChain\./, "");
    }

    return ruleId.replace(/^[^.]+\./, "");
}

function buildRuleNode(
    groupKey: RuleGroupBucket["key"],
    rule: ValidationRuleExecutionResult,
    _verbose: boolean
): TreeNode {
    const warnings = countValidationWarnings(rule.issues);
    const errors = countValidationErrors(rule.issues);

    return {
        severity: ruleSeverity(errors > 0, warnings > 0),
        title: buildRuleTitle(groupKey, rule.ruleId),
        summary: buildRuleSummary(rule),
        children:
            rule.reportNodes && rule.reportNodes.length > 0
                ? rule.reportNodes
                : undefined,
    };
}

function buildGroupNode(group: RuleGroupBucket, verbose: boolean): TreeNode {
    const warnings = group.rules.reduce(
        (sum, rule) => sum + countValidationWarnings(rule.issues),
        0
    );
    const errors = group.rules.reduce(
        (sum, rule) => sum + countValidationErrors(rule.issues),
        0
    );

    const children = group.rules.map((rule) =>
        buildRuleNode(group.key, rule, verbose)
    );

    return {
        severity: ruleSeverity(errors > 0, warnings > 0),
        title: strong(group.key),
        summary: buildGroupSummary(group),
        children,
    };
}

export function buildValidationReportTree(
    perRule: ValidationRuleExecutionResult[],
    verbose: boolean
): TreeNode[] {
    return orderedValidationGroups(perRule).map((group) =>
        buildGroupNode(group, verbose)
    );
}