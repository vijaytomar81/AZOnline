// src/toolingLayer/pageActions/validator/validate/pipeline/runValidationPipeline.ts

import type {
    ValidationCheckResult,
    ValidationNode,
    ValidationPipelineResult,
    ValidationRuleGroup,
    ValidationRuleGroupResult,
} from "./types";

function buildCheckNode(result: ValidationCheckResult): ValidationNode {
    return {
        severity: result.severity,
        title: result.id,
        summary: result.summary,
        children: result.nodes ?? [],
    };
}

function runGroup(group: ValidationRuleGroup): ValidationRuleGroupResult {
    const results = group.checks.map((check) => check());
    const warnings = results.filter((item) => item.severity === "warning").length;
    const errors = results.filter((item) => item.severity === "error").length;

    return {
        id: group.id,
        checks: results.length,
        warnings,
        errors,
        nodes: results.map(buildCheckNode),
    };
}

export function runValidationPipeline(
    groups: ValidationRuleGroup[]
): ValidationPipelineResult {
    const groupResults = groups.map(runGroup);
    const checksRun = groupResults.reduce((sum, item) => sum + item.checks, 0);
    const warnChecks = groupResults.reduce((sum, item) => sum + item.warnings, 0);
    const failedChecks = groupResults.reduce((sum, item) => sum + item.errors, 0);

    return {
        checksRun,
        passedChecks: checksRun - warnChecks - failedChecks,
        warnChecks,
        failedChecks,
        totalWarnings: warnChecks,
        totalErrors: failedChecks,
        groups: groupResults,
    };
}
