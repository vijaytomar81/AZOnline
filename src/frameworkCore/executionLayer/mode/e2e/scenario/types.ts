// src/frameworkCore/executionLayer/mode/e2e/scenario/types.ts

import type {
    ExecutionItem,
    ExecutionScenario,
    ExecutionJourneyStartWith,
} from "@frameworkCore/executionLayer/contracts";
import type { RawExecutionScenarioRow } from "@frameworkCore/executionLayer/runtime/scenarioSheet";

export type {
    RawExecutionScenarioRow,
    ExecutionItem,
    ExecutionScenario,
    ExecutionJourneyStartWith,
};

export type ScenarioValidationResult = {
    scenarioId: string;
    errors: string[];
};
