// src/toolingLayer/pageActions/validator/validate/pipeline/types.ts

export type ValidationSeverity = "success" | "warning" | "error";

export type ValidationNode = {
    severity?: ValidationSeverity;
    title: string;
    summary?: string;
    children?: ValidationNode[];
};

export type ValidationCheckResult = {
    id: string;
    severity: ValidationSeverity;
    summary: string;
    nodes?: ValidationNode[];
};

export type ValidationRuleGroup = {
    id: string;
    checks: Array<() => ValidationCheckResult>;
};

export type ValidationRuleGroupResult = {
    id: string;
    checks: number;
    warnings: number;
    errors: number;
    nodes: ValidationNode[];
};

export type ValidationPipelineResult = {
    checksRun: number;
    passedChecks: number;
    warnChecks: number;
    failedChecks: number;
    totalWarnings: number;
    totalErrors: number;
    groups: ValidationRuleGroupResult[];
};
