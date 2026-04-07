// src/executionLayer/mode/e2e/scenario/types.ts

import type {
    ExecutionEntryPoint,
    ExecutionItem,
    ExecutionPolicyContext,
    ExecutionScenario,
} from "@frameworkCore/executionLayer/contracts";
import type { RawExecutionScenarioRow } from "@frameworkCore/executionLayer/runtime/scenarioSheet";

export type {
    RawExecutionScenarioRow,
    ExecutionItem,
    ExecutionScenario,
    ExecutionEntryPoint,
    ExecutionPolicyContext,
};

export type ScenarioValidationResult = {
    scenarioId: string;
    errors: string[];
};
