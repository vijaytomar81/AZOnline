// src/execution/modes/e2e/scenario/parser.ts

import { AppError } from "@utils/errors";
import { normalizeScenarios } from "./normalizer";
import { validateScenarios } from "./validator";
import { validateE2EPipelineTemplateRows } from "./e2EPipelineTemplateValidator";
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
    const templateValidation = validateE2EPipelineTemplateRows(rows);

    if (opts.failOnTemplateErrors && hasErrors(templateValidation)) {
        throw new AppError({
            code: "SCENARIO_TEMPLATE_VALIDATION_FAILED",
            stage: "scenario-parsing",
            source: "parser",
            message: formatErrors(
                "E2E pipeline template validation failed",
                templateValidation
            ),
            context: {
                errorCount: templateValidation.length,
            },
        });
    }

    const normalized = normalizeScenarios(rows);
    const scenarios = filterDisabled(normalized, !!opts.includeDisabled);
    const validation = validateScenarios(scenarios);

    if (opts.failOnValidationErrors && hasErrors(validation)) {
        throw new AppError({
            code: "SCENARIO_VALIDATION_FAILED",
            stage: "scenario-parsing",
            source: "parser",
            message: formatErrors("Scenario validation failed", validation),
            context: {
                errorCount: validation.length,
            },
        });
    }

    return {
        scenarios,
        templateValidation,
        validation,
    };
}