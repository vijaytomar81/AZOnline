// src/toolingLayer/businessJourneys/validator/validate/pipeline/types.ts

export type ValidationSeverity =
    | "success"
    | "warning"
    | "error"
    | "info";

export type ValidationNode = {
    severity: ValidationSeverity;
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
    passed: number;
    warnings: number;
    errors: number;
    nodes: ValidationNode[];
};

export type ValidationPipelineResult = {
    groups: ValidationRuleGroupResult[];
    checksRun: number;
    passedChecks: number;
    warnChecks: number;
    failedChecks: number;
    totalWarnings: number;
    totalErrors: number;
};
