// src/execution/modes/e2e/scenario/validate/validateScenarioPortal.ts

import type { ScenarioStep } from "../types";
import { normalizeValidationKey } from "./shared";

export function validateScenarioPortal(step: ScenarioStep): string[] {
    const portal = normalizeValidationKey(step.portal);

    if (!portal) {
        return [`Step${step.stepNo}: Missing Portal`];
    }

    if (portal !== "customerportal" && portal !== "supportportal") {
        return [
            `Step${step.stepNo}: Portal must be CustomerPortal or SupportPortal`,
        ];
    }

    return [];
}
