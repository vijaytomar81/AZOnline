// src/execution/modes/e2e/scenario/validate/validateScenarioStepOrder.ts

import type { ScenarioStep } from "../types";

export function validateScenarioStepOrder(
    steps: ScenarioStep[]
): string[] {
    const errors: string[] = [];

    steps.forEach((step, index) => {
        const expected = index + 1;

        if (step.stepNo !== expected) {
            errors.push(
                `Scenario steps must be contiguous. Expected Step${expected} but found Step${step.stepNo}`
            );
        }
    });

    return errors;
}
