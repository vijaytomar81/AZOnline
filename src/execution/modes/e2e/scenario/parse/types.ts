// src/execution/modes/e2e/scenario/parse/types.ts

import type {
    ExecutionScenario,
    ScenarioValidationResult,
} from "../types";

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
