// src/tools/pageObjects/validator/validate/report/countValidationIssues.ts

import type { ValidationIssue } from "../types";

export function countValidationWarnings(issues: ValidationIssue[]): number {
    return issues.filter((issue) => issue.severity === "WARN").length;
}

export function countValidationErrors(issues: ValidationIssue[]): number {
    return issues.filter((issue) => issue.severity === "ERROR").length;
}