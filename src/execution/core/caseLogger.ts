// src/execution/core/caseLogger.ts

import {
    formatDuration,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@execution/core/logging/executionLogRenderer";

import {
    renderDataCaseBlock as renderDataCaseBlockInternal,
} from "@execution/core/logging/dataCaseLogRenderer";

import {
    renderE2EScenarioBlock as renderE2EScenarioBlockInternal,
} from "@execution/core/logging/e2eScenarioLogRenderer";

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult } from "@execution/core/result";

export { formatDuration, renderExecutionHeader, renderExecutionSummary };

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    return renderDataCaseBlockInternal(args);
}

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    return renderE2EScenarioBlockInternal(args);
}