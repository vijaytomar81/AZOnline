// src/tools/pageObjects/validator/validate/types.ts

import type { TreeNode } from "@utils/cliTree";

export type ValidationSeverity = "INFO" | "WARN" | "ERROR";

export type ValidationIssue = {
    ruleId: string;
    severity: ValidationSeverity;
    message: string;
    pageKey?: string;
    filePath?: string;
    issueLabel?: string;
};

export type ValidationRuleResult = {
    issues: ValidationIssue[];
    reportNodes?: TreeNode[];
};

export type ValidationRuleExecutionResult = {
    ruleId: string;
    description: string;
    issues: ValidationIssue[];
    reportNodes?: TreeNode[];
};

export type ValidationSummary = {
    totalRules: number;
    passedRules: number;
    warnedRules: number;
    failedRules: number;
    totalIssues: number;
    totalWarnings: number;
    totalErrors: number;
};

export type ValidationRunResult = {
    issues: ValidationIssue[];
    perRule: ValidationRuleExecutionResult[];
    summary: ValidationSummary;
};