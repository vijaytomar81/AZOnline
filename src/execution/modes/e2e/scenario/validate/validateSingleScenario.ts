// src/execution/modes/e2e/scenario/validate/validateSingleScenario.ts

import type { ExecutionScenario } from "../types";
import { validateScenarioIdentity } from "./validateScenarioIdentity";
import { validateScenarioStep } from "./validateScenarioStep";
import { validateScenarioStepOrder } from "./validateScenarioStepOrder";

export function validateSingleScenario(
    scenario: ExecutionScenario
): string[] {
    const errors: string[] = [];

    errors.push(...validateScenarioIdentity(scenario));

    if (!scenario.steps.length) {
        errors.push("At least one step is required");
        return errors;
    }

    errors.push(...validateScenarioStepOrder(scenario.steps));
    scenario.steps.forEach((step) => {
        errors.push(...validateScenarioStep(step));
    });

    return errors;
}
