// src/execution/scenario/parser.ts

import { normalizeScenarios } from "./normalizer";
import { validateScenarios } from "./validator";
import { validateScenarioTemplateRows } from "./templateValidator";
import type {
    ExecutionScenario,
    RawScenarioRow,
    ScenarioValidationResult,
} from "./types";

export type ParseScenariosResult = {
    scenarios: ExecutionScenario[];
    templateValidation: ScenarioValidationResult[];
    validation: ScenarioValidationResult[];
};

export type ParseScenariosOptions = {
    includeDisabled?: boolean;
    failOnTemplateErrors?: boolean;
    failOnValidationErrors?: boolean;
};

function hasErrors(items: ScenarioValidationResult[]): boolean {
    return items.some((item) => item.errors.length > 0);
}

function formatErrors(
    title: string,
    items: ScenarioValidationResult[]
): string {
    const lines = items
        .filter((item) => item.errors.length > 0)
        .flatMap((item) => item.errors.map((error) => `[${item.scenarioId}] ${error}`));

    return `${title}\n${lines.join("\n")}`;
}

function filterDisabled(
    scenarios: ExecutionScenario[],
    includeDisabled: boolean
): ExecutionScenario[] {
    return includeDisabled ? scenarios : scenarios.filter((item) => item.execute);
}

export function parseScenarios(
    rows: RawScenarioRow[],
    opts: ParseScenariosOptions = {}
): ParseScenariosResult {
    const templateValidation = validateScenarioTemplateRows(rows);

    if (opts.failOnTemplateErrors && hasErrors(templateValidation)) {
        throw new Error(formatErrors("Scenario template validation failed", templateValidation));
    }

    const normalized = normalizeScenarios(rows);
    const scenarios = filterDisabled(normalized, !!opts.includeDisabled);
    const validation = validateScenarios(scenarios);

    if (opts.failOnValidationErrors && hasErrors(validation)) {
        throw new Error(formatErrors("Scenario validation failed", validation));
    }

    return {
        scenarios,
        templateValidation,
        validation,
    };
}