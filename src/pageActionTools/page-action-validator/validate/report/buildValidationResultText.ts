// src/pageActionTools/page-action-validator/validate/report/buildValidationResultText.ts

import type { ValidationRuleResult } from "../types";
import { buildValidationReportTree } from "./buildValidationReportTree";

export function buildValidationResultText(
    results: ValidationRuleResult[]
): string {
    return buildValidationReportTree(results).join("\n");
}
