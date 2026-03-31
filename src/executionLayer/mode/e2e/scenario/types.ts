// src/executionLayer/mode/e2e/scenario/types.ts

import type {
    ExecutionEntryPoint,
    ExecutionItem,
    ExecutionPolicyContext,
    ExecutionScenario,
} from "@executionLayer/contracts";
import type { RawExecutionScenarioRow } from "@executionLayer/runtime/scenarioSheet";

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
