// src/executionLayer/mode/e2e/scenario/validate/validateSingleScenario.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import { validateExecutionItem } from "./validateExecutionItem";
import { validateExecutionItemOrder } from "./validateExecutionItemOrder";
import { validateScenarioIdentity } from "./validateScenarioIdentity";

export function validateSingleScenario(
    scenario: ExecutionScenario
): string[] {
    const errors: string[] = [];

    errors.push(...validateScenarioIdentity(scenario));

    if (!scenario.items.length) {
        errors.push("At least one execution item is required");
        return errors;
    }

    errors.push(...validateExecutionItemOrder(scenario.items));
    scenario.items.forEach((item) => {
        errors.push(...validateExecutionItem(item));
    });

    return errors;
}
