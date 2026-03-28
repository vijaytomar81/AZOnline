// src/execution/modes/e2e/scenario/validate/validateScenarioStep.ts

import type { ScenarioStep } from "../types";
import { validateScenarioPortal } from "./validateScenarioPortal";
import { normalizeValidationKey } from "./shared";

export function validateScenarioStep(step: ScenarioStep): string[] {
    const errors: string[] = [];

    if (!step.action) {
        errors.push(`Step${step.stepNo}: Missing Action`);
    }

    if (!step.testCaseId) {
        errors.push(`Step${step.stepNo}: Missing TestCaseId`);
    }

    errors.push(...validateScenarioPortal(step));

    if (normalizeValidationKey(step.action) !== "newbusiness" && !step.subType) {
        errors.push(`Step${step.stepNo}: Missing SubType`);
    }

    return errors;
}
