// src/pageActionTools/page-action-validator/validate/report/printSuggestedAction.ts

import type { ValidationRuleResult } from "../types";

export function printSuggestedAction(results: ValidationRuleResult[]): void {
    const hasErrors = results.some((x) => x.issues.some((y) => y.level === "error"));
    if (!hasErrors) return;
    console.log("");
    console.log("Suggested action");
    console.log("----------------");
    console.log("Run page action repair, then re-run validation.");
}
