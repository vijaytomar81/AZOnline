// src/execution/scenario/parser.ts
// src/execution/scenario/parser.ts

import { normalizeScenarios } from "./normalizer";
import { validateScenarios } from "./validator";
import type {
    ExecutionScenario,
    RawScenarioRow,
    ScenarioValidationResult,
} from "./types";

export type ParseScenariosResult = {
    scenarios: ExecutionScenario[];
    validation: ScenarioValidationResult[];
};

export type ParseScenariosOptions = {
    includeDisabled?: boolean;
    failOnValidationErrors?: boolean;
};

function hasErrors(items: ScenarioValidationResult[]): boolean {
    return items.some((item) => item.errors.length > 0);
}

function filterDisabled(
    scenarios: ExecutionScenario[],
    includeDisabled: boolean
): ExecutionScenario[] {
    if (includeDisabled) return scenarios;
    return scenarios.filter((scenario) => scenario.execute);
}

export function parseScenarios(
    rows: RawScenarioRow[],
    opts: ParseScenariosOptions = {}
): ParseScenariosResult {
    const includeDisabled = !!opts.includeDisabled;
    const normalized = normalizeScenarios(rows);
    const filtered = filterDisabled(normalized, includeDisabled);
    const validation = validateScenarios(filtered);

    if (opts.failOnValidationErrors && hasErrors(validation)) {
        const lines = validation
            .filter((item) => item.errors.length > 0)
            .flatMap((item) =>
                item.errors.map((error) => `[${item.scenarioId}] ${error}`)
            );

        throw new Error(`Scenario validation failed\n${lines.join("\n")}`);
    }

    return {
        scenarios: filtered,
        validation,
    };
}