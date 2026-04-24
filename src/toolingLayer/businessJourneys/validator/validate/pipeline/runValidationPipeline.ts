// src/toolingLayer/businessJourneys/validator/validate/pipeline/runValidationPipeline.ts

import type {
    ValidationPipelineResult,
    ValidationRuleGroup,
    ValidationRuleGroupResult,
} from "./types";

function runGroup(group: ValidationRuleGroup): ValidationRuleGroupResult {
    const results = group.checks.map((check) => check());

    const errors = results.filter((item) => item.severity === "error").length;
    const warnings = results.filter((item) => item.severity === "warning").length;
    const passed = results.filter((item) => item.severity === "success").length;

    return {
        id: group.id,
        checks: results.length,
        passed,
        warnings,
        errors,
        nodes: results.map((result) => ({
            severity: result.severity,
            title: result.id,
            summary: result.summary,
            children: result.nodes ?? [],
        })),
    };
}

export function runValidationPipeline(
    groups: ValidationRuleGroup[]
): ValidationPipelineResult {
    const groupResults = groups.map(runGroup);

    return {
        groups: groupResults,
        checksRun: groupResults.reduce((sum, item) => sum + item.checks, 0),
        passedChecks: groupResults.reduce((sum, item) => sum + item.passed, 0),
        warnChecks: groupResults.reduce((sum, item) => sum + item.warnings, 0),
        failedChecks: groupResults.reduce((sum, item) => sum + item.errors, 0),
        totalWarnings: groupResults.reduce((sum, item) => sum + item.warnings, 0),
        totalErrors: groupResults.reduce((sum, item) => sum + item.errors, 0),
    };
}
