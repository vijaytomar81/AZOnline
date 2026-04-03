// src/pageActionTools/page-action-validator/validate/report/buildValidationResultText.ts

import type { ValidationRuleResult } from "../types";
import { buildValidationReportTree } from "./buildValidationReportTree";

export function buildValidationResultText(
    results: ValidationRuleResult[],
    verbose: boolean
): string {
    return buildValidationReportTree(results, verbose).join("\n");
}
