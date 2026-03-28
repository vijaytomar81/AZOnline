// src/execution/core/context/createExecutionContext.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "./executionContext.types";

export function createExecutionContext(
    scenario: ExecutionScenario
): ExecutionContext {
    return {
        scenario,
        currentPolicyNumber: scenario.policyNumber,
        currentQuoteNumber: undefined,
        currentTransactionId: undefined,
        outputs: {},
        stepResults: [],
        browser: undefined,
        browserContext: undefined,
        page: undefined,
    };
}
