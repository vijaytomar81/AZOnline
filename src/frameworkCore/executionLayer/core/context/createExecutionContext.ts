// src/frameworkCore/executionLayer/core/context/createExecutionContext.ts

import { resolveEnvConfig } from "@configLayer/env";
import type { EnvKey } from "@configLayer/environments";
import type {
    ExecutionContext,
    ExecutionScenario,
} from "@frameworkCore/executionLayer/contracts";

export function createExecutionContext(
    scenario: ExecutionScenario,
    environment: EnvKey
): ExecutionContext {
    return {
        scenario,
        env: resolveEnvConfig(environment),
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