// src/toolingLayer/pageObjects/validator/validate/report/buildValidationResultText.ts

import { failure, success, warning } from "@utils/cliFormat";
import type { ValidationSummary } from "../types";

export function buildValidationResultText(summary: ValidationSummary): string {
    if (summary.totalErrors > 0) {
        return failure("ERROR FOUND");
    }

    if (summary.totalWarnings > 0) {
        return warning("WARNING FOUND");
    }

    return success("ALL GOOD");
}