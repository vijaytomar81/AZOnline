// src/execution/modes/e2e/scenario/template/validateBaseFields.ts

import { defaultE2EPipelineTemplateConfig } from "../e2EPipelineTemplateConfig";
import type { RawScenarioRow } from "../types";
import {
    getTemplateString,
    getTemplateTotalSteps,
    isTemplateDirectJourney,
    isTemplateExistingPolicy,
    isTemplateNewBusiness,
} from "./shared";
import { validateEntryPointValue } from "./validateEntryPointValue";

export function validateBaseFields(row: RawScenarioRow): string[] {
    const errors: string[] = [];
    const cfg = defaultE2EPipelineTemplateConfig;

    cfg.requiredBaseHeaders.forEach((header) => {
        if (!getTemplateString(row, header)) {
            if (header === "EntryPoint" && isTemplateExistingPolicy(row)) {
                return;
            }

            if (header === "EntryPoint" && isTemplateNewBusiness(row) && isTemplateDirectJourney(row)) {
                return;
            }

            errors.push(`Missing required field: ${header}`);
        }
    });

    const conditional = isTemplateExistingPolicy(row)
        ? cfg.conditionalBaseHeaders.existingPolicy
        : cfg.conditionalBaseHeaders.newBusiness;

    conditional.forEach((header) => {
        if (!getTemplateString(row, header)) {
            errors.push(
                `Missing required field for PolicyContext=${row.PolicyContext}: ${header}`
            );
        }
    });

    errors.push(...validateEntryPointValue(row));

    const totalSteps = getTemplateTotalSteps(row);

    if (totalSteps <= 0) {
        errors.push("TotalSteps must be a positive integer");
    }

    if (totalSteps > cfg.maxSteps) {
        errors.push(`TotalSteps must not exceed ${cfg.maxSteps}`);
    }

    return errors;
}
