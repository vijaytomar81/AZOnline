// src/tools/page-object-validator/validate/pipeline/runner.ts

import { VALIDATION_RULES } from "./registry";
import type { ValidationContext } from "./types";
import type {
    ValidationIssue,
    ValidationRuleExecutionResult,
    ValidationRunResult,
    ValidationSummary,
} from "../types";

function countWarnings(issues: ValidationIssue[]): number {
    return issues.filter((issue) => issue.severity === "WARN").length;
}

function countErrors(issues: ValidationIssue[]): number {
    return issues.filter((issue) => issue.severity === "ERROR").length;
}

function buildSummary(perRule: ValidationRuleExecutionResult[]): ValidationSummary {
    let passedRules = 0;
    let warnedRules = 0;
    let failedRules = 0;
    let totalWarnings = 0;
    let totalErrors = 0;

    for (const result of perRule) {
        const warnings = countWarnings(result.issues);
        const errors = countErrors(result.issues);

        totalWarnings += warnings;
        totalErrors += errors;

        if (errors > 0) {
            failedRules++;
        } else if (warnings > 0) {
            warnedRules++;
        } else {
            passedRules++;
        }
    }

    return {
        totalRules: perRule.length,
        passedRules,
        warnedRules,
        failedRules,
        totalIssues: totalWarnings + totalErrors,
        totalWarnings,
        totalErrors,
    };
}

export async function runValidationPipeline(
    ctx: ValidationContext
): Promise<ValidationRunResult> {
    const perRule: ValidationRuleExecutionResult[] = [];
    const allIssues: ValidationIssue[] = [];

    for (const rule of VALIDATION_RULES) {
        const ruleLog = ctx.log.child(rule.id);

        if (ctx.verbose) {
            ruleLog.info(`Start: ${rule.description}`);
        }

        const result = await rule.run({
            ...ctx,
            log: ruleLog,
        });

        const issues = result.issues ?? [];
        allIssues.push(...issues);

        if (ctx.verbose) {
            const warnings = countWarnings(issues);
            const errors = countErrors(issues);

            if (issues.length === 0) {
                ruleLog.info("Completed: no issues");
            } else {
                ruleLog.info(`Completed: ${warnings} warning(s), ${errors} error(s)`);
            }
        }

        perRule.push({
            ruleId: rule.id,
            description: rule.description,
            issues,
            reportNodes: result.reportNodes,
        });
    }

    const summary = buildSummary(perRule);

    if (ctx.verbose) {
        ctx.log.info(
            `Validation complete: ${summary.totalRules} rule(s), ${summary.totalWarnings} warning(s), ${summary.totalErrors} error(s)`
        );
    }

    return {
        issues: allIssues,
        perRule,
        summary,
    };
}