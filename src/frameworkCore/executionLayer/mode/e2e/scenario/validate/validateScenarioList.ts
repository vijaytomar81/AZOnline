// src/executionLayer/mode/e2e/scenario/validate/validateScenarioList.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { ScenarioValidationResult } from "../types";
import { validateSingleScenario } from "./validateSingleScenario";

export function validateScenarioList(
    scenarios: ExecutionScenario[]
): ScenarioValidationResult[] {
    return scenarios.map((scenario) => ({
        scenarioId: scenario.scenarioId || "(missing)",
        errors: validateSingleScenario(scenario),
    }));
}
