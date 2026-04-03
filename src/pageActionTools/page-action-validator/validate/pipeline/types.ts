// src/pageActionTools/page-action-validator/validate/pipeline/types.ts

import type {
    ValidationContext,
    ValidationRule,
    ValidationRuleResult,
} from "../types";

export type ValidationPipelineArgs = {
    context: ValidationContext;
    rules: ValidationRule[];
};

export type ValidationPipelineResult = {
    context: ValidationContext;
    results: ValidationRuleResult[];
};
