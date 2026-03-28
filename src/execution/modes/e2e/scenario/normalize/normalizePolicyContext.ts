// src/execution/modes/e2e/scenario/normalize/normalizePolicyContext.ts

import type { ScenarioPolicyContext } from "../types";
import { normalizeScenarioKey } from "./shared";

export function normalizePolicyContext(
    value: unknown
): ScenarioPolicyContext {
    return normalizeScenarioKey(value) === "existingpolicy"
        ? "ExistingPolicy"
        : "NewBusiness";
}
