// src/tools/pageObjects/validator/validate/report.ts

import { printTree } from "@utils/cliTree";
import { printSection, printSummary } from "@utils/cliFormat";
import type { ValidationRunResult } from "./types";
import { buildValidationReportTree } from "./report/buildValidationReportTree";
import { buildValidationResultText } from "./report/buildValidationResultText";
import { buildValidationSummaryRows } from "./report/buildValidationSummaryRows";
import { printSuggestedAction } from "./report/printSuggestedAction";

export function printValidationExecution(
    result: ValidationRunResult,
    verbose = false
): void {
    printSection("Rule execution");
    printTree(buildValidationReportTree(result.perRule, verbose));
}

export function printValidationSummary(result: ValidationRunResult): void {
    const summary = result.summary;

    printSummary(
        "VALIDATE SUMMARY",
        buildValidationSummaryRows(summary),
        buildValidationResultText(summary)
    );

    printSuggestedAction(summary);
}