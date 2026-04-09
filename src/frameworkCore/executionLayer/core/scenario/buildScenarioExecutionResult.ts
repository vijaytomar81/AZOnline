// src/frameworkCore/executionLayer/core/scenario/buildScenarioExecutionResult.ts

import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { buildExecutionScenarioResult } from "@frameworkCore/executionLayer/core/result";

export function buildScenarioExecutionResult(
    context: ExecutionContext
): ExecutionScenarioResult & {
    browser?: unknown;
    scenarioName?: string;
    platform?: string;
    application?: string;
    product?: string;
    journeyStartWith?: string;
    policyNumber?: string;
    loginId?: string;
    description?: string;
} {
    const base = buildExecutionScenarioResult({
        scenarioId: context.scenario.scenarioId,
        itemResults: context.itemResults,
        outputs: context.outputs,
    });

    return {
        ...base,
        scenarioName: context.scenario.scenarioName,
        platform: context.scenario.platform,
        application: context.scenario.application,
        product: context.scenario.product,
        journeyStartWith: context.scenario.journeyStartWith,
        policyNumber: context.scenario.policyNumber,
        loginId: context.scenario.loginId,
        description: context.scenario.description,
        browser: context.browserInfo,
    };
}
