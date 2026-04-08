// src/frameworkCore/executionLayer/core/context/createExecutionContext.ts

import type { ExecutionContext, ExecutionScenario } from "@frameworkCore/executionLayer/contracts";

export function createExecutionContext(
    scenario: ExecutionScenario
): ExecutionContext {
    return {
        scenario,
        currentPolicyNumber: scenario.policyNumber,
        currentQuoteNumber: undefined,
        currentTransactionId: undefined,
        outputs: {},
        itemResults: [],
        browser: undefined,
        browserContext: undefined,
        page: undefined,
    };
}
